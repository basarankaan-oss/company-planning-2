'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '../lib/supabase';

const supabase = createClient();

const today = () => new Date().toISOString().slice(0, 10);

const statusText = (s) =>
  s === 'approved'
    ? 'Onaylandı'
    : s === 'rejected'
      ? 'Reddedildi'
      : 'Bekliyor';

const duration = (a, b) => {
  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);

  let m = bh * 60 + bm - (ah * 60 + am);

  if (m < 0) m += 1440;

  return m / 60;
};

const normalizeText = (value) =>
  String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const formatDate = (date) => {
  return new Date(`${date}T12:00:00`).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
  });
};

const getMonday = (dateString) => {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + diff);

  return date;
};

const formatISODate = (date) => {
  return date.toISOString().slice(0, 10);
};

const getWeekDays = (monday) => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return formatISODate(date);
  });
};

const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function PlanningApp() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(data.session || null);

      if (data.session) {
        loadProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    }

    async function loadProfile(id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id,full_name,role,employee_number')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (!session) {
        setProfile(null);
        setLoading(false);
      } else {
        setLoading(true);
        loadProfile(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (!profile) {
    return <div className="loading">Profil yükleniyor...</div>;
  }

  if (profile.role === 'admin') {
    return <AdminPanel profile={profile} onLogout={logout} />;
  }

  return <EmployeePanel profile={profile} onLogout={logout} />;
}

function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');

    if (mode === 'signup') {
      const cleanPhone = phone.trim();

      if (!cleanPhone) {
        setMessage('Lütfen telefon numaranı gir.');
        setBusy(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: cleanPhone,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName.trim(),
            email: email.trim(),
            phone: cleanPhone,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error(profileError);
          setMessage(
            'Hesap oluşturuldu ancak profil bilgileri kaydedilemedi: ' +
              profileError.message
          );
        } else {
          setMessage(
            'Hesap oluşturuldu. E-posta doğrulaması açıksa gelen kutunu kontrol et.'
          );
        }
      }
    } else {
      const loginValue = email.trim();
      let loginEmail = loginValue;

      if (!loginValue.includes('@')) {
        const { data: phoneData, error: phoneError } =
          await supabase.rpc('get_auth_email_by_phone', {
            p_phone: loginValue,
          });

        if (phoneError) {
          console.error(phoneError);
          setMessage(
            'Telefonla giriş ayarı bulunamadı. Yönetici Supabase SQL adımını tamamlamalı.'
          );
          setBusy(false);
          return;
        }

        if (!phoneData) {
          setMessage(
            'Bu telefon numarasıyla kayıtlı bir hesap bulunamadı.'
          );
          setBusy(false);
          return;
        }

        loginEmail = phoneData;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        setMessage(error.message);
      }
    }

    setBusy(false);
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="logo">
          COMPANY <span>PLANNING</span>
        </div>

        <p className="eyebrow">
          {mode === 'login' ? 'GİRİŞ' : 'YENİ HESAP'}
        </p>

        <h1>
          {mode === 'login' ? 'Hoş geldin.' : 'Hesap oluştur.'}
        </h1>

        <p className="muted">
          {mode === 'login'
            ? 'Planning sistemine giriş yap.'
            : 'Çalışan hesabını oluştur.'}
        </p>

        <form onSubmit={submit} className="form">
          {mode === 'signup' && (
            <label>
              İsim Soyisim
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Ahmet Yılmaz"
              />
            </label>
          )}

          {mode === 'signup' && (
            <label>
              Telefon numarası
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+31 6 12345678"
              />
            </label>
          )}

          <label>
            {mode === 'login'
              ? 'E-posta veya telefon numarası'
              : 'E-posta'}
            <input
              type={mode === 'login' ? 'text' : 'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={
                mode === 'login'
                  ? 'ahmet@company.com veya +31 6 12345678'
                  : 'ahmet@company.com'
              }
            />
          </label>

          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder="En az 6 karakter"
            />
          </label>

          <button className="primary" disabled={busy}>
            {busy
              ? 'Bekleyin...'
              : mode === 'login'
                ? 'GİRİŞ YAP →'
                : 'HESAP OLUŞTUR →'}
          </button>
        </form>

        {message && <div className="notice">{message}</div>}

        <button
          className="link-btn"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setMessage('');
          }}
        >
          {mode === 'login'
            ? 'İlk kez mi kullanıyorsun? Hesap oluştur'
            : 'Zaten hesabın var mı? Giriş yap'}
        </button>
      </div>
    </main>
  );
}

function Header({ name, employeeNumber, role, onLogout }) {
  return (
    <header className="topbar">
      <div className="logo">
        COMPANY <span>PLANNING</span>
      </div>

      <div className="user">
        <span>
          <strong>
            {name}
            {employeeNumber ? ` · ${employeeNumber}` : ''}
          </strong>
          <small>{role}</small>
        </span>

        <button onClick={onLogout}>Çıkış</button>
      </div>
    </header>
  );
}

function EmployeePanel({ profile, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [message, setMessage] = useState('');

  async function loadRequests() {
    setLoadingRequests(true);

    const { data, error } = await supabase
      .from('shift_requests')
      .select(
        'id,date,start_time,end_time,location_id,note,status,created_at,locations(name),profiles!shift_requests_admin_id_fkey(full_name)'
      )
      .eq('employee_id', profile.id)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setRequests(data || []);
    }

    setLoadingRequests(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function respondToRequest(request, status) {
    setMessage('');

    const { error: updateError } = await supabase
      .from('shift_requests')
      .update({
        status,
        responded_at: new Date().toISOString(),
      })
      .eq('id', request.id)
      .eq('employee_id', profile.id);

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    if (status === 'accepted') {
      const { error: shiftError } = await supabase
        .from('shifts')
        .insert({
          employee_id: profile.id,
          date: request.date,
          start_time: request.start_time,
          end_time: request.end_time,
          location_id: request.location_id,
          status: 'approved',
        });

      if (shiftError) {
        console.error(shiftError);

        setMessage(
          'Talep kabul edildi ancak plan oluşturulurken bir hata oluştu: ' +
            shiftError.message
        );

        await loadRequests();
        return;
      }

      setMessage(
        '✓ Çalışabileceğin onaylandı ve planın takvime eklendi.'
      );
    } else {
      setMessage('Talep reddedildi.');
    }

    await loadRequests();
  }

  function requestStatusText(status) {
    if (status === 'accepted') return 'Çalışabilirim';
    if (status === 'rejected') return 'Çalışamam';
    return 'Cevap bekleniyor';
  }

  return (
    <main className="page">
      <Header
        name={profile.full_name}
        employeeNumber={profile.employee_number}
        role="Çalışan"
        onLogout={onLogout}
      />

      <div className="content">
        <div className="hero">
          <p className="eyebrow">ÇALIŞAN PANELİ</p>

          <h1>Çalışma taleplerin.</h1>

          <p className="muted">
            Yöneticinin gönderdiği çalışma taleplerini buradan
            görüntüleyip cevaplayabilirsin.
          </p>
        </div>

        {message && (
          <div
            className="notice"
            style={{ marginBottom: '18px' }}
          >
            {message}
          </div>
        )}

        <section className="card">
          <h2>Çalışma Taleplerim</h2>

          {loadingRequests ? (
            <p className="muted">Talepler yükleniyor...</p>
          ) : !requests.length ? (
            <p className="muted">
              Şu anda bekleyen veya geçmiş bir çalışma talebin yok.
            </p>
          ) : (
            <div className="mini-list">
              {requests.map((request) => (
                <div
                  className="mini-row"
                  key={request.id}
                  style={{
                    alignItems: 'center',
                    gap: '24px',
                  }}
                >
                  <div>
                    <strong>{request.date}</strong>

                    <span>
                      {request.start_time.slice(0, 5)} –{' '}
                      {request.end_time.slice(0, 5)}
                    </span>

                    <span>
                      {request.locations?.name || '-'}
                    </span>

                    {request.profiles?.full_name && (
                      <span>
                        Yönetici: {request.profiles.full_name}
                      </span>
                    )}

                    {request.note && (
                      <span>
                        Not: {request.note}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px',
                    }}
                  >
                    <em
                      className={
                        request.status === 'accepted'
                          ? 'approved'
                          : request.status === 'rejected'
                            ? 'rejected'
                            : 'pending'
                      }
                    >
                      {requestStatusText(request.status)}
                    </em>

                    {request.status === 'pending' && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <button
                          className="primary"
                          style={{
                            height: '38px',
                            padding: '0 12px',
                          }}
                          onClick={() =>
                            respondToRequest(
                              request,
                              'accepted'
                            )
                          }
                        >
                          Çalışabilirim
                        </button>

                        <button
                          className="secondary"
                          onClick={() =>
                            respondToRequest(
                              request,
                              'rejected'
                            )
                          }
                        >
                          Çalışamam
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
function AdminPanel({ profile, onLogout }) {
  const [shifts, setShifts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const [weekStart, setWeekStart] = useState(
    getMonday(today())
  );

  // Çalışma talebi formu
  const [requestEmployee, setRequestEmployee] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [requestStart, setRequestStart] = useState('');
  const [requestEnd, setRequestEnd] = useState('');
  const [requestLocation, setRequestLocation] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [requestBusy, setRequestBusy] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  async function load() {
    const [
      { data: ss, error: shiftError },
      { data: locs, error: locationError },
      { data: emps, error: employeeError },
    ] = await Promise.all([
      supabase
        .from('shifts')
        .select(
          'id,date,start_time,end_time,status,profiles(id,full_name,employee_number),locations(name)'
        )
        .order('date', { ascending: false })
        .order('start_time'),

      supabase
        .from('locations')
        .select('id,name')
        .order('name'),

      supabase
        .from('profiles')
        .select('id,full_name,email,phone,employee_number,role')
        .eq('role', 'employee')
        .order('full_name'),
    ]);

    if (shiftError) {
      console.error(shiftError);
    }

    if (locationError) {
      console.error(locationError);
    }

    if (employeeError) {
      console.error(employeeError);
    }

    setShifts(ss || []);
    setLocations(locs || []);
    setEmployees(emps || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from('shifts')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      await load();
    }
  }

  async function remove(id) {
    if (!confirm('Bu plan silinsin mi?')) return;

    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      await load();
    }
  }

  async function sendShiftRequest(e) {
    e.preventDefault();

    setRequestMessage('');

    if (
      !requestEmployee ||
      !requestDate ||
      !requestStart ||
      !requestEnd ||
      !requestLocation
    ) {
      setRequestMessage(
        'Lütfen çalışan, tarih, saat ve şehir alanlarını doldurun.'
      );
      return;
    }

    if (requestEnd <= requestStart) {
      setRequestMessage(
        'Bitiş saati başlangıç saatinden sonra olmalıdır.'
      );
      return;
    }

    setRequestBusy(true);

    const { error } = await supabase
      .from('shift_requests')
      .insert({
        employee_id: requestEmployee,
        admin_id: profile.id,
        location_id: requestLocation,
        date: requestDate,
        start_time: requestStart,
        end_time: requestEnd,
        note: requestNote.trim() || null,
        status: 'pending',
      });

    if (error) {
      console.error(error);
      setRequestMessage(error.message);
    } else {
      setRequestMessage(
        '✓ Çalışma talebi başarıyla gönderildi.'
      );

      setRequestEmployee('');
      setRequestDate('');
      setRequestStart('');
      setRequestEnd('');
      setRequestLocation('');
      setRequestNote('');
    }

    setRequestBusy(false);
  }

  const filtered = useMemo(() => {
    const searchTerm = normalizeText(search.trim());

    return shifts.filter((s) => {
      const employeeName = normalizeText(
        s.profiles?.full_name
      );

      const employeeNumber = normalizeText(
        s.profiles?.employee_number
      );

      const matchesSearch =
        !searchTerm ||
        employeeName.includes(searchTerm) ||
        employeeNumber.includes(searchTerm);

      const matchesDate =
        !date || s.date === date;

      const matchesLocation =
        !location ||
        s.locations?.name === location;

      return (
        matchesSearch &&
        matchesDate &&
        matchesLocation
      );
    });
  }, [shifts, search, date, location]);

  const filteredEmployees = useMemo(() => {
    const searchTerm = normalizeText(
      employeeSearch.trim()
    );

    if (!searchTerm) {
      return employees;
    }

    return employees.filter((employee) => {
      const name = normalizeText(employee.full_name);
      const number = normalizeText(
        employee.employee_number
      );
      const email = normalizeText(employee.email);
      const phone = normalizeText(employee.phone);

      return (
        name.includes(searchTerm) ||
        number.includes(searchTerm) ||
        email.includes(searchTerm) ||
        phone.includes(searchTerm)
      );
    });
  }, [employees, employeeSearch]);

  function employeeTotalHours(employeeId) {
    return shifts
      .filter(
        (shift) =>
          shift.profiles?.id === employeeId
      )
      .reduce(
        (total, shift) =>
          total +
          duration(
            shift.start_time,
            shift.end_time
          ),
        0
      );
  }

  const weekDays = useMemo(
    () => getWeekDays(weekStart),
    [weekStart]
  );

  const weekShifts = useMemo(() => {
    return filtered.filter((s) =>
      weekDays.includes(s.date)
    );
  }, [filtered, weekDays]);

  const employeesInWeek = useMemo(() => {
    const map = new Map();

    weekShifts.forEach((shift) => {
      const employeeId =
        shift.profiles?.id ||
        shift.profiles?.employee_number ||
        shift.profiles?.full_name;

      if (employeeId && !map.has(employeeId)) {
        map.set(employeeId, shift.profiles);
      }
    });

    return Array.from(map.values());
  }, [weekShifts]);

  function changeWeek(amount) {
    const next = new Date(weekStart);

    next.setDate(
      next.getDate() + amount * 7
    );

    setWeekStart(next);
  }

  function goToCurrentWeek() {
    setWeekStart(getMonday(today()));
  }

  function exportCsv() {
    const rows = [
      [
        'Personel No',
        'İsim Soyisim',
        'Tarih',
        'Başlangıç',
        'Bitiş',
        'Yer',
        'Durum',
      ],

      ...filtered.map((s) => [
        s.profiles?.employee_number || '',
        s.profiles?.full_name || '',
        s.date,
        s.start_time.slice(0, 5),
        s.end_time.slice(0, 5),
        s.locations?.name || '',
        statusText(s.status),
      ]),
    ];

    const csv =
      '\ufeff' +
      rows
        .map((r) =>
          r
            .map(
              (v) =>
                `"${String(v).replaceAll(
                  '"',
                  '""'
                )}"`
            )
            .join(';')
        )
        .join('\n');

    const a = document.createElement('a');

    a.href = URL.createObjectURL(
      new Blob([csv], {
        type: 'text/csv;charset=utf-8',
      })
    );

    a.download = 'planning.csv';
    a.click();

    URL.revokeObjectURL(a.href);
  }

  const total = shifts.reduce(
    (n, s) =>
      n +
      duration(
        s.start_time,
        s.end_time
      ),
    0
  );

  const employeeCount = employees.length;

  const weekTitle = `${formatDate(
    weekDays[0]
  )} – ${formatDate(weekDays[6])}`;

  return (
    <main className="page">
      <Header
        name={profile.full_name}
        employeeNumber={profile.employee_number}
        role="Yönetici"
        onLogout={onLogout}
      />

      <div className="content">

        {/* HEADER */}
        <div className="admin-head">
          <div>
            <p className="eyebrow">
              YÖNETİCİ PANELİ
            </p>

            <h1>Planning</h1>

            <p className="muted">
              Şirketin bütün çalışma planlarını yönet.
            </p>
          </div>

          <button
            className="secondary"
            onClick={exportCsv}
          >
            CSV İNDİR
          </button>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="stats">
          <div className="stat">
            <span>Toplam plan</span>
            <strong>{shifts.length}</strong>
          </div>

          <div className="stat">
            <span>Çalışan</span>
            <strong>{employeeCount}</strong>
          </div>

          <div className="stat">
            <span>Toplam saat</span>
            <strong>{total.toFixed(1)}</strong>
          </div>
        </div>

        {/* ÇALIŞANLAR */}
        <section
          className="card"
          style={{ marginBottom: '18px' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <p className="eyebrow">
              PERSONEL
            </p>

            <h2 style={{ marginBottom: '8px' }}>
              Çalışanlar
            </h2>

            <p className="muted">
              Şirket çalışanlarını, iletişim bilgilerini
              ve toplam çalışma saatlerini görüntüle.
            </p>
          </div>

          <input
            placeholder="İsim, personel no, e-posta veya telefon ara..."
            value={employeeSearch}
            onChange={(e) =>
              setEmployeeSearch(e.target.value)
            }
            style={{ marginBottom: '16px' }}
          />

          {!filteredEmployees.length ? (
            <div className="empty">
              Aramanıza uygun çalışan bulunamadı.
            </div>
          ) : (
            <div className="table-wrap">
              <table
                style={{
                  minWidth: '900px',
                }}
              >
                <thead>
                  <tr>
                    <th>Personel No</th>
                    <th>Çalışan</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>Toplam Saat</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map(
                    (employee) => (
                      <tr key={employee.id}>
                        <td>
                          <span className="badge">
                            {employee.employee_number ||
                              '-'}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {employee.full_name ||
                              'Bilinmiyor'}
                          </strong>
                        </td>

                        <td>
                          {employee.email || '-'}
                        </td>

                        <td>
                          {employee.phone || '-'}
                        </td>

                        <td>
                          <strong>
                            {employeeTotalHours(
                              employee.id
                            ).toFixed(1)}
                            {' saat'}
                          </strong>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ÇALIŞMA TALEBİ */}
        <section
          className="card"
          style={{ marginBottom: '18px' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <p className="eyebrow">
              YENİ TALEP
            </p>

            <h2 style={{ marginBottom: '8px' }}>
              Çalışma Talebi Gönder
            </h2>

            <p className="muted">
              Bir çalışana belirli tarih, saat ve şehir
              için çalışma talebi gönder.
            </p>
          </div>

          <form
            className="form"
            onSubmit={sendShiftRequest}
          >

            {/* ÇALIŞAN */}
            <label>
              Çalışan

              <select
                value={requestEmployee}
                onChange={(e) =>
                  setRequestEmployee(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Çalışan seçin
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.full_name}
                    {employee.employee_number
                      ? ` · ${employee.employee_number}`
                      : ''}
                  </option>
                ))}
              </select>
            </label>

            {/* TARİH */}
            <label>
              Tarih

              <input
                type="date"
                value={requestDate}
                onChange={(e) =>
                  setRequestDate(
                    e.target.value
                  )
                }
                required
              />
            </label>

            {/* SAAT */}
            <div className="two">
              <label>
                Başlangıç

                <input
                  type="time"
                  value={requestStart}
                  onChange={(e) =>
                    setRequestStart(
                      e.target.value
                    )
                  }
                  required
                />
              </label>

              <label>
                Bitiş

                <input
                  type="time"
                  value={requestEnd}
                  onChange={(e) =>
                    setRequestEnd(
                      e.target.value
                    )
                  }
                  required
                />
              </label>
            </div>

            {/* ŞEHİR */}
            <label>
              Şehir

              <select
                value={requestLocation}
                onChange={(e) =>
                  setRequestLocation(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Şehir seçin
                </option>

                {locations.map((l) => (
                  <option
                    key={l.id}
                    value={l.id}
                  >
                    {l.name}
                  </option>
                ))}
              </select>
            </label>

            {/* NOT */}
            <label>
              Not

              <span
                style={{
                  fontWeight: 500,
                  color: '#7b818a',
                  fontSize: '12px',
                }}
              >
                İsteğe bağlı
              </span>

              <input
                type="text"
                placeholder="Örn. Sabah vardiyası için müsait misin?"
                value={requestNote}
                onChange={(e) =>
                  setRequestNote(
                    e.target.value
                  )
                }
              />
            </label>

            <button
              className="primary"
              disabled={requestBusy}
            >
              {requestBusy
                ? 'Gönderiliyor...'
                : 'ÇALIŞMA TALEBİ GÖNDER →'}
            </button>

            {requestMessage && (
              <div className="notice">
                {requestMessage}
              </div>
            )}
          </form>
        </section>

        {/* FİLTRELER */}
        <div className="toolbar card">
          <input
            placeholder="Çalışan veya personel no ara..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          >
            <option value="">
              Tüm yerler
            </option>

            {locations.map((l) => (
              <option
                key={l.id}
                value={l.name}
              >
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* HAFTALIK PLANNING */}
        <section className="card">
          <div className="calendar-header">
            <div>
              <p className="eyebrow">
                HAFTALIK PLANNING
              </p>

              <h2>{weekTitle}</h2>
            </div>

            <div className="calendar-actions">
              <button
                className="secondary"
                onClick={() =>
                  changeWeek(-1)
                }
              >
                ← Önceki
              </button>

              <button
                className="secondary"
                onClick={goToCurrentWeek}
              >
                Bu hafta
              </button>

              <button
                className="secondary"
                onClick={() =>
                  changeWeek(1)
                }
              >
                Sonraki →
              </button>
            </div>
          </div>

          <div className="planning-calendar">
            <div className="calendar-row calendar-days">
              <div className="employee-column">
                ÇALIŞAN
              </div>

              {weekDays.map(
                (day, index) => (
                  <div
                    className="day-column"
                    key={day}
                  >
                    <strong>
                      {dayNames[index]}
                    </strong>

                    <span>
                      {formatDate(day)}
                    </span>
                  </div>
                )
              )}
            </div>

            {!employeesInWeek.length ? (
              <div className="empty">
                Bu haftada plan bulunmuyor.
              </div>
            ) : (
              employeesInWeek.map(
                (employee) => (
                  <div
                    className="calendar-row"
                    key={
                      employee.id ||
                      employee.employee_number ||
                      employee.full_name
                    }
                  >
                    <div className="employee-column employee-name">
                      <strong>
                        {employee.full_name}
                      </strong>

                      {employee.employee_number && (
                        <span>
                          {employee.employee_number}
                        </span>
                      )}
                    </div>

                    {weekDays.map((day) => {
                      const dayShifts =
                        weekShifts.filter(
                          (s) =>
                            s.date === day &&
                            s.profiles?.id ===
                              employee.id
                        );

                      return (
                        <div
                          className="day-column shift-cell"
                          key={`${employee.id}-${day}`}
                        >
                          {dayShifts.map(
                            (shift) => (
                              <div
                                className={`shift-card ${shift.status}`}
                                key={shift.id}
                                title={`${employee.full_name} • ${shift.start_time.slice(
                                  0,
                                  5
                                )}–${shift.end_time.slice(
                                  0,
                                  5
                                )} • ${
                                  shift.locations?.name ||
                                  '-'
                                }`}
                              >
                                <strong>
                                  {shift.start_time.slice(
                                    0,
                                    5
                                  )}
                                  –
                                  {shift.end_time.slice(
                                    0,
                                    5
                                  )}
                                </strong>

                                <span>
                                  {shift.locations?.name ||
                                    '-'}
                                </span>

                                <small>
                                  {statusText(
                                    shift.status
                                  )}
                                </small>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )
            )}
          </div>
        </section>
        {/* TÜM PLANLAR */}
        <div className="card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Personel No</th>
                  <th>Çalışan</th>
                  <th>Tarih</th>
                  <th>Saat</th>
                  <th>Yer</th>
                  <th>Durum</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="badge">
                        {s.profiles?.employee_number || '-'}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {s.profiles?.full_name || 'Bilinmiyor'}
                      </strong>
                    </td>

                    <td>{s.date}</td>

                    <td>
                      {s.start_time.slice(0, 5)} –{' '}
                      {s.end_time.slice(0, 5)}
                    </td>

                    <td>
                      <span className="badge">
                        {s.locations?.name || '-'}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={s.status}
                        onChange={(e) =>
                          updateStatus(
                            s.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="pending">
                          Bekliyor
                        </option>

                        <option value="approved">
                          Onaylandı
                        </option>

                        <option value="rejected">
                          Reddedildi
                        </option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="delete"
                        onClick={() => remove(s.id)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filtered.length && (
            <div className="empty">
              Bu filtrelere uyan plan yok.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

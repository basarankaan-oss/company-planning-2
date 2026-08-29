'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '../lib/supabase';

const supabase = createClient();

const LANGUAGES = {
  tr: { label: 'Türkçe', flag: '🇹🇷' },
  nl: { label: 'Nederlands', flag: '🇳🇱' },
  en: { label: 'English', flag: '🇬🇧' },
};

const translations = {
  tr: {
    loading: 'Yükleniyor...', profileLoading: 'Profil yükleniyor...',
    login: 'GİRİŞ', signup: 'YENİ HESAP', welcome: 'Hoş geldin.',
    createAccount: 'Hesap oluştur.', loginDesc: 'Planning sistemine giriş yap.', companyName: 'SUPRA & INFRA',
    signupDesc: 'Çalışan hesabını oluştur.', name: 'İsim Soyisim',
    phone: 'Telefon numarası', emailOrPhone: 'E-posta veya telefon numarası',
    email: 'E-posta', password: 'Şifre', wait: 'Bekleyin...',
    loginBtn: 'GİRİŞ YAP →', signupBtn: 'HESAP OLUŞTUR →',
    phonePlaceholder: '+31 6 12345678', passwordPlaceholder: 'En az 6 karakter',
    createPrompt: 'İlk kez mi kullanıyorsun? Hesap oluştur',
    loginPrompt: 'Zaten hesabın var mı? Giriş yap',
    invalidPhone: 'Lütfen telefon numaranı gir.',
    accountCreated: 'Hesap oluşturuldu. E-posta doğrulaması açıksa gelen kutunu kontrol et.',
    phoneNotFound: 'Bu telefon numarasıyla kayıtlı bir hesap bulunamadı.',
    employee: 'Çalışan', admin: 'Yönetici', logout: 'Çıkış',
    employeePanel: 'ÇALIŞAN PANELİ', requestsTitle: 'Çalışma Taleplerim',
    employeeHero: 'Çalışma taleplerin.',
    employeeDesc: 'Yöneticinin gönderdiği çalışma taleplerini buradan görüntüleyip cevaplayabilirsin.',
    requestsLoading: 'Talepler yükleniyor...', noRequests: 'Şu anda bekleyen veya geçmiş bir çalışma talebin yok.',
    accepted: 'Çalışabilirim', rejected: 'Çalışamam', pendingResponse: 'Cevap bekleniyor',
    approved: 'Onaylandı', rejectedStatus: 'Reddedildi', pending: 'Bekliyor',
    adminPanel: 'YÖNETİCİ PANELİ', planning: 'Planning',
    adminDesc: 'Şirketin bütün çalışma planlarını yönet.', csv: 'CSV İNDİR',
    totalPlans: 'Toplam plan', employees: 'Çalışan', totalHours: 'Toplam saat',
    personnel: 'PERSONEL', employeesTitle: 'Çalışanlar',
    employeesDesc: 'Şirket çalışanlarını, iletişim bilgilerini ve toplam çalışma saatlerini görüntüle.',
    searchEmployee: 'İsim, personel no, e-posta veya telefon ara...',
    noEmployee: 'Aramanıza uygun çalışan bulunamadı.',
    employeeNo: 'Personel No', totalHour: 'Toplam Saat', topEmployees: 'En Çok Çalışan 5 Personel', rank: 'Sıra', period: 'Dönem', allTime: 'Tüm dönem', currentMonth: 'Bu ay', currentWeek: 'Bu hafta',
    newRequest: 'YENİ TALEP', sendRequest: 'Çalışma Talebi Gönder',
    sendRequestDesc: 'Bir çalışana belirli tarih, saat ve şehir için çalışma talebi gönder.',
    chooseEmployee: 'Çalışan seçin', date: 'Tarih', start: 'Başlangıç', end: 'Bitiş',
    city: 'Şehir', chooseCity: 'Şehir seçin', note: 'Not', optional: 'İsteğe bağlı',
    sendRequestBtn: 'ÇALIŞMA TALEBİ GÖNDER →', sending: 'Gönderiliyor...',
    requestSent: '✓ Çalışma talebi başarıyla gönderildi.',
    fillFields: 'Lütfen çalışan, tarih, saat ve şehir alanlarını doldurun.',
    endAfterStart: 'Bitiş saati başlangıç saatinden sonra olmalıdır.',
    filters: 'TÜM PLANLAR', allPlaces: 'Tüm yerler',
    searchShort: 'Çalışan veya personel no ara...',
    weekly: 'HAFTALIK PLANNING', previous: '← Önceki', thisWeek: 'Bu hafta', next: 'Sonraki →',
    noWeekPlans: 'Bu haftada plan bulunmuyor.', worker: 'ÇALIŞAN', hour: 'saat',
    status: 'Durum', place: 'Yer', delete: 'Sil', noFiltered: 'Bu filtrelere uyan plan yok.',
    employeeDetail: 'ÇALIŞAN DETAYI', noEmp: 'EMP numarası yok', close: 'Kapat',
    upcoming: 'YAKLAŞAN VARDİYALAR', planned: 'Planlanan çalışmalar',
    noUpcoming: 'Yaklaşan vardiya bulunmuyor.', history: 'ÇALIŞMA GEÇMİŞİ', recentShifts: 'Son çalışmalar', noHistory: 'Geçmiş çalışma bulunmuyor.', emailLabel: 'E-posta', phoneLabel: 'Telefon',
    thisMonth: 'Bu ay',
    shiftConflict: 'Vardiya çakışması',
    shiftConflictDesc: 'Bu çalışanın seçilen saatlerde zaten başka bir vardiyası bulunuyor.',
    existingShift: 'Mevcut vardiya',
    cannotSendConflict: 'Çalışma talebi gönderilemedi çünkü vardiya çakışıyor.',
    notifications: 'Bildirimler',
    newRequestNotification: 'Yeni çalışma talebin var.',
    pendingRequests: 'Bekleyen talepler',
    requestResponseNotification: 'Bir çalışma talebine cevap geldi.',
  },
  nl: {
    loading: 'Laden...', profileLoading: 'Profiel laden...', login: 'INLOGGEN', signup: 'NIEUW ACCOUNT',
    welcome: 'Welkom.', createAccount: 'Account aanmaken.', loginDesc: 'Log in op het planningssysteem.', companyName: 'SUPRA & INFRA',
    signupDesc: 'Maak je medewerkersaccount aan.', name: 'Voor- en achternaam', phone: 'Telefoonnummer',
    emailOrPhone: 'E-mail of telefoonnummer', email: 'E-mail', password: 'Wachtwoord', wait: 'Even geduld...',
    loginBtn: 'INLOGGEN →', signupBtn: 'ACCOUNT AANMAKEN →', phonePlaceholder: '+31 6 12345678',
    passwordPlaceholder: 'Minimaal 6 tekens', createPrompt: 'Nieuw? Account aanmaken',
    loginPrompt: 'Heb je al een account? Inloggen', invalidPhone: 'Voer je telefoonnummer in.',
    accountCreated: 'Account aangemaakt. Controleer je inbox als e-mailverificatie is ingeschakeld.',
    phoneNotFound: 'Geen account gevonden met dit telefoonnummer.', employee: 'Medewerker', admin: 'Beheerder',
    logout: 'Uitloggen', employeePanel: 'MEDEWERKERSPANEEL', requestsTitle: 'Mijn werkverzoeken',
    employeeHero: 'Je werkverzoeken.', employeeDesc: 'Bekijk en beantwoord hier werkverzoeken van je manager.',
    requestsLoading: 'Verzoeken laden...', noRequests: 'Je hebt momenteel geen openstaande of eerdere werkverzoeken.',
    accepted: 'Ik kan werken', rejected: 'Ik kan niet werken', pendingResponse: 'Wachten op antwoord',
    approved: 'Goedgekeurd', rejectedStatus: 'Afgewezen', pending: 'In afwachting',
    adminPanel: 'BEHEERPANEEL', planning: 'Planning', adminDesc: 'Beheer alle werkplanningen van het bedrijf.',
    csv: 'CSV DOWNLOADEN', totalPlans: 'Totaal plannen', employees: 'Medewerkers', totalHours: 'Totaal uren',
    personnel: 'PERSONEEL', employeesTitle: 'Medewerkers',
    employeesDesc: 'Bekijk medewerkers, contactgegevens en totale gewerkte uren.',
    searchEmployee: 'Zoek op naam, personeelsnummer, e-mail of telefoon...',
    noEmployee: 'Geen medewerker gevonden voor deze zoekopdracht.', employeeNo: 'Personeelsnr.',
    totalHour: 'Totaal uren', topEmployees: 'Top 5 medewerkers met de meeste uren', rank: 'Rang', period: 'Periode', allTime: 'Alle perioden', currentMonth: 'Deze maand', currentWeek: 'Deze week', newRequest: 'NIEUW VERZOEK', sendRequest: 'Werkverzoek versturen',
    sendRequestDesc: 'Stuur een medewerker een werkverzoek voor een datum, tijd en stad.',
    chooseEmployee: 'Kies medewerker', date: 'Datum', start: 'Start', end: 'Einde',
    city: 'Stad', chooseCity: 'Kies stad', note: 'Notitie', optional: 'Optioneel',
    sendRequestBtn: 'WERKVERZOEK VERSTUREN →', sending: 'Versturen...',
    requestSent: '✓ Werkverzoek succesvol verstuurd.', fillFields: 'Vul medewerker, datum, tijd en stad in.',
    endAfterStart: 'De eindtijd moet na de starttijd liggen.', filters: 'ALLE PLANNEN',
    allPlaces: 'Alle locaties', searchShort: 'Zoek medewerker of personeelsnummer...',
    weekly: 'WEKELIJKSE PLANNING', previous: '← Vorige', thisWeek: 'Deze week', next: 'Volgende →',
    noWeekPlans: 'Geen planning voor deze week.', worker: 'MEDEWERKER', hour: 'uur', status: 'Status',
    place: 'Locatie', delete: 'Verwijderen', noFiltered: 'Geen plannen voor deze filters.',
    employeeDetail: 'MEDEWERKERDETAIL', noEmp: 'Geen personeelsnummer', close: 'Sluiten',
    upcoming: 'KOMENDE DIENSTEN', planned: 'Geplande diensten', noUpcoming: 'Geen komende diensten.', history: 'WERKGESCHIEDENIS', recentShifts: 'Recente diensten', noHistory: 'Geen werkgeschiedenis.',
    emailLabel: 'E-mail', phoneLabel: 'Telefoon', thisMonth: 'Deze maand',
    shiftConflict: 'Dienstconflict',
    shiftConflictDesc: 'Deze medewerker heeft op de gekozen tijden al een andere dienst.',
    existingShift: 'Bestaande dienst',
    cannotSendConflict: 'Het werkverzoek kan niet worden verstuurd omdat de diensten overlappen.',
    notifications: 'Meldingen',
    newRequestNotification: 'Je hebt een nieuw werkverzoek.',
    pendingRequests: 'Openstaande verzoeken',
    requestResponseNotification: 'Er is een antwoord op een werkverzoek ontvangen.',
  },
  en: {
    loading: 'Loading...', profileLoading: 'Loading profile...', login: 'LOGIN', signup: 'NEW ACCOUNT',
    welcome: 'Welcome.', createAccount: 'Create an account.', loginDesc: 'Sign in to the planning system.', companyName: 'SUPRA & INFRA',
    signupDesc: 'Create your employee account.', name: 'Full name', phone: 'Phone number',
    emailOrPhone: 'Email or phone number', email: 'Email', password: 'Password', wait: 'Please wait...',
    loginBtn: 'LOG IN →', signupBtn: 'CREATE ACCOUNT →', phonePlaceholder: '+31 6 12345678',
    passwordPlaceholder: 'At least 6 characters', createPrompt: 'New here? Create an account',
    loginPrompt: 'Already have an account? Log in', invalidPhone: 'Please enter your phone number.',
    accountCreated: 'Account created. Check your inbox if email verification is enabled.',
    phoneNotFound: 'No account was found with this phone number.', employee: 'Employee', admin: 'Administrator',
    logout: 'Log out', employeePanel: 'EMPLOYEE PANEL', requestsTitle: 'My Work Requests',
    employeeHero: 'Your work requests.', employeeDesc: 'View and respond to work requests from your manager here.',
    requestsLoading: 'Loading requests...', noRequests: 'You currently have no pending or previous work requests.',
    accepted: 'I can work', rejected: 'I cannot work', pendingResponse: 'Awaiting response',
    approved: 'Approved', rejectedStatus: 'Rejected', pending: 'Pending', adminPanel: 'ADMIN PANEL',
    planning: 'Planning', adminDesc: 'Manage all company work schedules.', csv: 'DOWNLOAD CSV',
    totalPlans: 'Total plans', employees: 'Employees', totalHours: 'Total hours', personnel: 'PERSONNEL',
    employeesTitle: 'Employees', employeesDesc: 'View employees, contact details and total working hours.',
    searchEmployee: 'Search name, employee no., email or phone...', noEmployee: 'No employee found.',
    employeeNo: 'Employee No.', totalHour: 'Total Hours', topEmployees: 'Top 5 Employees by Hours Worked', rank: 'Rank', period: 'Period', allTime: 'All time', currentMonth: 'This month', currentWeek: 'This week', newRequest: 'NEW REQUEST',
    sendRequest: 'Send Work Request', sendRequestDesc: 'Send an employee a work request for a specific date, time and city.',
    chooseEmployee: 'Choose employee', date: 'Date', start: 'Start', end: 'End', city: 'City',
    chooseCity: 'Choose city', note: 'Note', optional: 'Optional', sendRequestBtn: 'SEND WORK REQUEST →',
    sending: 'Sending...', requestSent: '✓ Work request sent successfully.',
    fillFields: 'Please fill in employee, date, time and city.', endAfterStart: 'End time must be after start time.',
    filters: 'ALL PLANS', allPlaces: 'All locations', searchShort: 'Search employee or employee no...',
    weekly: 'WEEKLY PLANNING', previous: '← Previous', thisWeek: 'This week', next: 'Next →',
    noWeekPlans: 'No plans this week.', worker: 'EMPLOYEE', hour: 'hours', status: 'Status',
    place: 'Location', delete: 'Delete', noFiltered: 'No plans match these filters.',
    employeeDetail: 'EMPLOYEE DETAILS', noEmp: 'No employee number', close: 'Close',
    upcoming: 'UPCOMING SHIFTS', planned: 'Scheduled work', noUpcoming: 'No upcoming shifts.', history: 'WORK HISTORY', recentShifts: 'Recent shifts', noHistory: 'No work history.',
    emailLabel: 'Email', phoneLabel: 'Phone', thisMonth: 'This month',
    shiftConflict: 'Shift conflict',
    shiftConflictDesc: 'This employee already has another shift during the selected time.',
    existingShift: 'Existing shift',
    cannotSendConflict: 'The work request cannot be sent because the shifts overlap.',
    notifications: 'Notifications',
    newRequestNotification: 'You have a new work request.',
    pendingRequests: 'Pending requests',
    requestResponseNotification: 'A work request has received a response.',
  },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'tr';
  return localStorage.getItem('planning-language') || 'tr';
};

const translateStatus = (s, lang) => {
  const t = translations[lang] || translations.tr;
  return s === 'approved' ? t.approved : s === 'rejected' ? t.rejectedStatus : t.pending;
};

const translateDayNames = (lang) => {
  if (lang === 'nl') return ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  if (lang === 'en') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
};

function LanguageSelector({ language, onChange }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: '20px',
        bottom: '20px',
        zIndex: 1200,
      }}
    >
      <select
        value={language}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Language"
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '9px 12px',
          background: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        {Object.entries(LANGUAGES).map(([code, item]) => (
          <option key={code} value={code}>
            {item.flag} {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const today = () => new Date().toISOString().slice(0, 10);

const statusText = (s, lang = 'tr') => translateStatus(s, lang);

const duration = (a, b) => {
  if (!a || !b) return 0;

  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);

  if (
    !Number.isFinite(ah) ||
    !Number.isFinite(am) ||
    !Number.isFinite(bh) ||
    !Number.isFinite(bm)
  ) {
    return 0;
  }

  let startMinutes = ah * 60 + am;
  let endMinutes = bh * 60 + bm;

  // Gece yarısını geçen vardiyalar da doğru hesaplanır.
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};

const normalizeText = (value) =>
  String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const formatDate = (date, lang = 'tr') => {
  const locale = lang === 'nl' ? 'nl-NL' : lang === 'en' ? 'en-GB' : 'tr-TR';
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
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
  const [language, setLanguage] = useState(getInitialLanguage);

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
        .select('id,full_name,role,employee_number,language')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setProfile(data);
      if (data.language && LANGUAGES[data.language]) {
        setLanguage(data.language);
        localStorage.setItem('planning-language', data.language);
      }
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
    return <div className="loading">{translations[language].loading}</div>;
  }

  if (!session) {
    return <AuthScreen language={language} setLanguage={setLanguage} />;
  }

  if (!profile) {
    return <div className="loading">{translations[language].profileLoading}</div>;
  }

  if (profile.role === 'admin') {
    return <AdminPanel profile={profile} onLogout={logout} language={language} setLanguage={setLanguage} />;
  }

  return <EmployeePanel profile={profile} onLogout={logout} language={language} setLanguage={setLanguage} />;
}

function CompanyBrand({ compact = false, language = 'tr' }) {
  const t = translations[language] || translations.tr;

  const uiStyles = `
    * { box-sizing: border-box; }

    .dashboard-content { width: min(1180px, calc(100% - 40px)); margin-left: auto; margin-right: auto; }
    .dashboard-hero { position: relative; }
    .dashboard-hero h1 { letter-spacing: -0.035em; }
    .card { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
    .card:hover { box-shadow: 0 14px 38px rgba(21,35,59,.07); }
    .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .stat { min-width: 0; }
    .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    table { min-width: 680px; }
    .company-brand { user-select: none; }
    .topbar { min-height: 72px; padding: 14px 24px; gap: 20px; }
    .topbar .user { display: flex; align-items: center; gap: 14px; }
    .topbar .user > span { min-width: 0; }
    .topbar .user strong { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
    .auth-page { padding: 28px 20px; }
    .auth-card { width: min(100%, 460px); }
    input, select, button { min-height: 44px; }

    @media (max-width: 760px) {
      .dashboard-content { width: min(100% - 24px, 680px); }
      .topbar { padding: 12px; min-height: 64px; flex-wrap: wrap; }
      .topbar .user { width: 100%; justify-content: space-between; gap: 8px; }
      .topbar .user strong { max-width: 190px; }
      .stats { grid-template-columns: 1fr; gap: 10px; }
      .dashboard-hero { padding-top: 4px; }
      .dashboard-hero h1 { font-size: clamp(32px, 9vw, 48px); }
      .card { border-radius: 18px !important; }
      .form .two { grid-template-columns: 1fr !important; }
      .language-selector, .lang-selector { left: 12px !important; bottom: 12px !important; }
      .language-selector select, .lang-selector select { max-width: 160px; }
      .auth-page { padding: 18px 12px 82px; align-items: flex-start !important; }
      .auth-card { margin-top: 18px; padding: 24px !important; border-radius: 22px !important; }
    }

    @media (max-width: 430px) {
      .topbar .company-brand-compact { transform: scale(.88); transform-origin: left center; }
      .topbar .user button { padding-left: 12px !important; padding-right: 12px !important; }
      .dashboard-content { width: calc(100% - 16px); }
      .card { padding: 16px !important; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: uiStyles }} />
      <div
        className={compact ? 'company-brand company-brand-compact' : 'company-brand'}
      aria-label={t.companyName}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: compact ? '2px' : '5px',
        color: '#15233b',
        letterSpacing: compact ? '0.16em' : '0.22em',
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: compact ? '8px' : '12px' }}>
        <span>{'SUPRA'}</span>
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: compact ? '42px' : '68px',
            height: compact ? '3px' : '4px',
            background: '#15233b',
            borderRadius: '999px',
          }}
        />
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: compact ? '8px' : '12px' }}>
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: compact ? '34px' : '54px',
            height: compact ? '3px' : '4px',
            background: '#15233b',
            borderRadius: '999px',
          }}
        />
        <span>&amp; INFRA</span>
      </span>
      </div>
    </>
  );
}

function AuthScreen({ language, setLanguage }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const t = translations[language] || translations.tr;

  function changeLanguage(next) {
    setLanguage(next);
    localStorage.setItem('planning-language', next);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');

    if (mode === 'signup') {
      const rawPhone = phone.trim();

      const digits = rawPhone.replace(/\D/g, '');

      let cleanPhone = rawPhone;

      if (digits.startsWith('06') && digits.length === 10) {
        cleanPhone = '+31' + digits.slice(1);
      } else if (digits.startsWith('316') && digits.length === 11) {
        cleanPhone = '+' + digits;
      } else if (digits.startsWith('31') && digits.length === 11) {
        cleanPhone = '+' + digits;
      } else if (digits.startsWith('6') && digits.length === 9) {
        cleanPhone = '+31' + digits;
      } else if (rawPhone.startsWith('+')) {
        cleanPhone = '+' + digits;
      }

      if (!cleanPhone) {
        setMessage(t.invalidPhone);
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
            language,
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
            language,
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
    <main className="auth-page" style={{ position: 'relative' }}>
      <LanguageSelector language={language} onChange={changeLanguage} />
      <div className="auth-card">
        <div style={{ marginBottom: '30px' }}>
          <CompanyBrand language={language} />
        </div>

        <p className="eyebrow">
          {mode === 'login' ? t.login : t.signup}
        </p>

        <h1>
          {mode === 'login' ? t.welcome : t.createAccount}
        </h1>

        <p className="muted">
          {mode === 'login' ? t.loginDesc : t.signupDesc}
        </p>

        <form onSubmit={submit} className="form">
          {mode === 'signup' && (
            <label>
              {t.name}
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
              {t.phone}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder={t.phonePlaceholder}
              />
            </label>
          )}

          <label>
            {mode === 'login' ? t.emailOrPhone : t.email}
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
            {t.password}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder={t.passwordPlaceholder}
            />
          </label>

          <button className="primary" disabled={busy}>
            {busy
              ? t.wait
              : mode === 'login'
                ? t.loginBtn
                : t.signupBtn}
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
          {mode === 'login' ? t.signupPrompt : t.loginPrompt}
        </button>
      </div>
    </main>
  );
}

function Header({ name, employeeNumber, role, onLogout, language, setLanguage }) {
  return (
    <header className="topbar" style={{ position: 'relative' }}>
      <CompanyBrand compact language={language} />

      <LanguageSelector language={language} onChange={setLanguage} />

      <div className="user">
        <span>
          <strong>
            {name}
            {employeeNumber ? ` · ${employeeNumber}` : ''}
          </strong>
          <small>{role}</small>
        </span>

        <button onClick={onLogout}>{translations[language]?.logout || 'Çıkış'}</button>
      </div>
    </header>
  );
}

function EmployeePanel({ profile, onLogout, language, setLanguage }) {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [message, setMessage] = useState('');
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');
  const t = translations[language] || translations.tr;

  useEffect(() => {
    localStorage.setItem('planning-language', language);
    if (profile?.id) {
      supabase
        .from('profiles')
        .update({ language })
        .eq('id', profile.id)
        .then(({ error }) => error && console.error(error));
    }
  }, [language, profile?.id]);

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

  useEffect(() => {
    const channel = supabase
      .channel(`employee-request-notifications-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shift_requests',
          filter: `employee_id=eq.${profile.id}`,
        },
        () => {
          setNewRequestCount((count) => count + 1);
          setNotificationMessage(t.newRequestNotification);
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile.id, language]);

  useEffect(() => {
    setNewRequestCount(
      requests.filter((request) => request.status === 'pending').length
    );
  }, [requests]);

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
    if (status === 'accepted') return t.accepted;
    if (status === 'rejected') return t.rejected;
    return t.pendingResponse;
  }

  return (
    <main className="page">
      <Header
        name={profile.full_name}
        employeeNumber={profile.employee_number}
        role={translations[language].employee}
        onLogout={onLogout}
        language={language}
        setLanguage={setLanguage}
      />

      <div className="content dashboard-content">
        {notificationMessage && (
          <div
            className="notice"
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <strong>🔔 {notificationMessage}</strong>
            <button
              className="secondary"
              onClick={() => setNotificationMessage('')}
            >
              {t.close}
            </button>
          </div>
        )}

        <div className="hero dashboard-hero">
          <p className="eyebrow">{t.employeePanel}</p>

          <h1>{t.employeeHero}</h1>

          <p className="muted">
            {t.employeeDesc}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <h2 style={{ margin: 0 }}>{t.requestsTitle}</h2>
            {newRequestCount > 0 && (
              <span className="badge">
                🔔 {newRequestCount} {t.pendingRequests}
              </span>
            )}
          </div>

          {loadingRequests ? (
            <p className="muted">{t.requestsLoading}</p>
          ) : !requests.length ? (
            <p className="muted">
              {t.noRequests}
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
                        {t.note}: {request.note}
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
                          {t.accepted}
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
                          {t.rejected}
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

function AdminPanel({ profile, onLogout, language, setLanguage }) {
  const [shifts, setShifts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
  const [adminNotification, setAdminNotification] = useState('');
  const [dashboardPeriod, setDashboardPeriod] = useState('month');
  const t = translations[language] || translations.tr;

  useEffect(() => {
    localStorage.setItem('planning-language', language);
    if (profile?.id) supabase.from('profiles').update({ language }).eq('id', profile.id).then(({ error }) => error && console.error(error));
  }, [language, profile?.id]);

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

  useEffect(() => {
    const channel = supabase
      .channel(`admin-request-notifications-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shift_requests',
        },
        (payload) => {
          // Realtime filtrelemesini burada yapıyoruz.
          // Böylece admin_id filtresi nedeniyle bildirimin kaçırılmasını önlüyoruz.
          if (payload.new?.admin_id === profile.id) {
            setAdminNotification(t.requestResponseNotification);
            load();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Admin notification channel error');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile.id, language]);

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

  function findShiftConflict(employeeId, shiftDate, startTime, endTime) {
    const toMinutes = (value) => {
      const [hours, minutes] = String(value || '00:00')
        .slice(0, 5)
        .split(':')
        .map(Number);

      return hours * 60 + minutes;
    };

    const newStart = toMinutes(startTime);
    let newEnd = toMinutes(endTime);

    if (newEnd <= newStart) {
      newEnd += 24 * 60;
    }

    return shifts.find((shift) => {
      if (shift.profiles?.id !== employeeId) return false;
      if (shift.date !== shiftDate) return false;
      if (shift.status === 'rejected') return false;

      const existingStart = toMinutes(shift.start_time);
      let existingEnd = toMinutes(shift.end_time);

      if (existingEnd <= existingStart) {
        existingEnd += 24 * 60;
      }

      return existingStart < newEnd && existingEnd > newStart;
    });
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
        t.endAfterStart
      );
      return;
    }

    const conflict = findShiftConflict(
      requestEmployee,
      requestDate,
      requestStart,
      requestEnd
    );

    if (conflict) {
      const employee = employees.find(
        (item) => item.id === requestEmployee
      );

      const employeeName = employee?.full_name || t.employee;
      const conflictLocation = conflict.locations?.name || t.place;
      const conflictStart = conflict.start_time.slice(0, 5);
      const conflictEnd = conflict.end_time.slice(0, 5);

      setRequestMessage(
        `⚠️ ${t.shiftConflict}: ${employeeName} — ` +
        `${t.existingShift}: ${conflictStart}–${conflictEnd} · ` +
        `${conflictLocation}. ${t.cannotSendConflict}`
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
          shift.profiles?.id === employeeId &&
          shift.status === 'approved'
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

  const dashboardRange = useMemo(() => {
    const todayDate = today();

    if (dashboardPeriod === 'week') {
      const current = new Date(`${todayDate}T00:00:00`);
      const day = current.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;

      const start = new Date(current);
      start.setDate(current.getDate() + mondayOffset);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const toIso = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayNumber = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${dayNumber}`;
      };

      return {
        start: toIso(start),
        end: toIso(end),
      };
    }

    if (dashboardPeriod === 'month') {
      return {
        start: `${todayDate.slice(0, 7)}-01`,
        end: `${todayDate.slice(0, 7)}-31`,
      };
    }

    return {
      start: null,
      end: null,
    };
  }, [dashboardPeriod]);

  const dashboardShifts = useMemo(() => {
    return shifts.filter((shift) => {
      if (shift.status !== 'approved') return false;
      if (!dashboardRange.start || !dashboardRange.end) return true;

      return (
        shift.date >= dashboardRange.start &&
        shift.date <= dashboardRange.end
      );
    });
  }, [shifts, dashboardRange]);

  const dashboardTotalHours = useMemo(() => {
    return dashboardShifts.reduce(
      (sum, shift) =>
        sum + duration(shift.start_time, shift.end_time),
      0
    );
  }, [dashboardShifts]);

  const topEmployees = useMemo(() => {
    return employees
      .map((employee) => ({
        ...employee,
        totalHours: dashboardShifts
          .filter((shift) => shift.profiles?.id === employee.id)
          .reduce(
            (sum, shift) =>
              sum + duration(shift.start_time, shift.end_time),
            0
          ),
      }))
      .filter((employee) => employee.totalHours > 0)
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 5);
  }, [employees, dashboardShifts]);

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
        statusText(s.status, language),
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

  const total = shifts
    .filter((s) => s.status === 'approved')
    .reduce(
      (n, s) =>
        n +
        duration(
          s.start_time,
          s.end_time
        ),
      0
    );

  const employeeCount = employees.length;

  const weekTitle = `${formatDate(weekDays[0], language)} – ${formatDate(weekDays[6], language)}`;

  return (
    <main className="page">
      <Header
        name={profile.full_name}
        employeeNumber={profile.employee_number}
        role={translations[language].admin}
        onLogout={onLogout}
        language={language}
        setLanguage={setLanguage}
      />

      <div className="content dashboard-content">

        {adminNotification && (
          <div
            className="notice"
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <strong>🔔 {adminNotification}</strong>
            <button
              className="secondary"
              onClick={() => setAdminNotification('')}
            >
              {t.close}
            </button>
          </div>
        )}

        {/* HEADER */}
        <div className="admin-head dashboard-hero">
          <div>
            <p className="eyebrow">
              YÖNETİCİ PANELİ
            </p>

            <div style={{ marginBottom: '18px' }}>
              <CompanyBrand compact language={language} />
            </div>
            <h1>{t.planning}</h1>

            <p className="muted">
              {t.adminDesc}
            </p>
          </div>

          <button
            className="secondary"
            onClick={exportCsv}
          >
            {t.csv}
          </button>
        </div>

        {/* DASHBOARD DÖNEMİ */}
        <div
          className="card"
          style={{
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p className="eyebrow">{t.period}</p>
            <strong>
              {dashboardPeriod === 'week'
                ? t.currentWeek
                : dashboardPeriod === 'month'
                  ? t.currentMonth
                  : t.allTime}
            </strong>
          </div>

          <select
            value={dashboardPeriod}
            onChange={(e) =>
              setDashboardPeriod(e.target.value)
            }
            style={{ maxWidth: '220px' }}
          >
            <option value="week">{t.currentWeek}</option>
            <option value="month">{t.currentMonth}</option>
            <option value="all">{t.allTime}</option>
          </select>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="stats">
          <div className="stat">
            <span>{t.totalPlans}</span>
            <strong>{shifts.length}</strong>
          </div>

          <div className="stat">
            <span>{t.employees}</span>
            <strong>{employeeCount}</strong>
          </div>

          <div className="stat">
            <span>{t.totalHours}</span>
            <strong>{dashboardTotalHours.toFixed(1)}</strong>
          </div>
        </div>

        {/* EN ÇOK ÇALIŞAN 5 PERSONEL */}
        <section
          className="card"
          style={{ marginBottom: '18px' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <p className="eyebrow">
              {t.personnel}
            </p>

            <h2 style={{ marginBottom: '8px' }}>
              {t.topEmployees}
            </h2>
          </div>

          {!topEmployees.length ? (
            <div className="empty">
              {t.noEmployee}
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t.rank}</th>
                    <th>{t.employee}</th>
                    <th>{t.employeeNo}</th>
                    <th>{t.totalHour}</th>
                  </tr>
                </thead>

                <tbody>
                  {topEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <strong>
                          {index === 0
                            ? '🥇'
                            : index === 1
                              ? '🥈'
                              : index === 2
                                ? '🥉'
                                : index + 1}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {employee.full_name || '-'}
                        </strong>
                      </td>

                      <td>
                        <span className="badge">
                          {employee.employee_number || '-'}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {employee.totalHours.toFixed(1)} {t.hour}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ÇALIŞANLAR */}
        <section
          className="card"
          style={{ marginBottom: '18px' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <p className="eyebrow">
              {t.personnel}
            </p>

            <h2 style={{ marginBottom: '8px' }}>
              {t.employeesTitle}
            </h2>

            <p className="muted">
              Şirket çalışanlarını, iletişim bilgilerini
              {t.employeesDesc}
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
              {t.noEmployee}
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
                    <th>{t.employeeNo}</th>
                    <th>{t.employee}</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>{t.totalHour}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="badge">
                          {employee.employee_number || '-'}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {employee.full_name || 'Bilinmiyor'}
                        </strong>
                      </td>

                      <td>{employee.email || '-'}</td>

                      <td>{employee.phone || '-'}</td>

                      <td>
                        <strong>
                          {employeeTotalHours(employee.id).toFixed(1)} saat
                        </strong>
                      </td>
                    </tr>
                  ))}
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
              {t.newRequest}
            </p>

            <h2 style={{ marginBottom: '8px' }}>
              {t.sendRequest}
            </h2>

            <p className="muted">
              {t.sendRequestDesc}
            </p>
          </div>

          <form
            className="form"
            onSubmit={sendShiftRequest}
          >
            <label>
              {t.employee}

              <select
                value={requestEmployee}
                onChange={(e) =>
                  setRequestEmployee(e.target.value)
                }
                required
              >
                <option value="">
                  {t.chooseEmployee}
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

            <label>
              {t.date}

              <input
                type="date"
                value={requestDate}
                onChange={(e) =>
                  setRequestDate(e.target.value)
                }
                required
              />
            </label>

            <div className="two">
              <label>
                {t.start}

                <input
                  type="time"
                  value={requestStart}
                  onChange={(e) =>
                    setRequestStart(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                {t.end}

                <input
                  type="time"
                  value={requestEnd}
                  onChange={(e) =>
                    setRequestEnd(e.target.value)
                  }
                  required
                />
              </label>
            </div>

            <label>
              {t.city}

              <select
                value={requestLocation}
                onChange={(e) =>
                  setRequestLocation(e.target.value)
                }
                required
              >
                <option value="">
                  {t.chooseCity}
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

            <label>
              {t.note}

              <span
                style={{
                  fontWeight: 500,
                  color: '#7b818a',
                  fontSize: '12px',
                }}
              >
                {t.optional}
              </span>

              <input
                type="text"
                placeholder="Örn. Sabah vardiyası için müsait misin?"
                value={requestNote}
                onChange={(e) =>
                  setRequestNote(e.target.value)
                }
              />
            </label>

            <button
              className="primary"
              disabled={requestBusy}
            >
              {requestBusy
                ? t.sending
                : t.sendRequestBtn}
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
              {t.allPlaces}
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
                {t.previous}
              </button>

              <button
                className="secondary"
                onClick={goToCurrentWeek}
              >
                {t.thisWeek}
              </button>

              <button
                className="secondary"
                onClick={() =>
                  changeWeek(1)
                }
              >
                {t.next}
              </button>
            </div>
          </div>

          <div className="planning-calendar">
            <div className="calendar-row calendar-days">
              <div className="employee-column">
                {t.worker}
              </div>

              {weekDays.map(
                (day, index) => (
                  <div
                    className="day-column"
                    key={day}
                  >
                    <strong>
                      {translateDayNames(language)[index]}
                    </strong>

                    <span>
                      {formatDate(day, language)}
                    </span>
                  </div>
                )
              )}
            </div>

            {!employeesInWeek.length ? (
              <div className="empty">
                {t.noWeekPlans}
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
                        onClick={() =>
                          remove(s.id)
                        }
                      >
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filtered.length && (
            <div className="empty">
              {t.noFiltered}
            </div>
          )}
        </div>

        {/* ÇALIŞAN DETAY PENCERESİ */}
        {selectedEmployee && (
          <div
            onClick={() =>
              setSelectedEmployee(null)
            }
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1000,
            }}
          >
            <div
              className="card"
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                width: 'min(600px, 100%)',
                maxHeight: '85vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <button
                className="secondary"
                onClick={() =>
                  setSelectedEmployee(null)
                }
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                }}
              >
                {t.close}
              </button>

              <p className="eyebrow">
                {t.employeeDetail}
              </p>

              <h2
                style={{
                  fontSize: '28px',
                  marginBottom: '6px',
                  paddingRight: '80px',
                }}
              >
                {selectedEmployee.full_name}
              </h2>

              <p className="muted">
                {selectedEmployee.employee_number ||
                  'EMP numarası yok'}
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: '12px',
                  marginTop: '24px',
                }}
              >
                <div className="notice">
                  <strong>📧 {t.emailLabel}</strong>
                  <br />
                  {selectedEmployee.email || '-'}
                </div>

                <div className="notice">
                  <strong>📱 {t.phoneLabel}</strong>
                  <br />
                  {selectedEmployee.phone || '-'}
                </div>
              </div>

              <div
                className="stats"
                style={{
                  marginTop: '18px',
                }}
              >
                <div className="stat">
                  <span>{t.thisWeek}</span>
                  <strong>
                    {shifts
                      .filter((shift) => {
                        return (
                          shift.profiles?.id ===
                            selectedEmployee.id &&
                          shift.status === 'approved' &&
                          shift.date >= weekDays[0] &&
                          shift.date <= weekDays[6]
                        );
                      })
                      .reduce(
                        (total, shift) =>
                          total +
                          duration(
                            shift.start_time,
                            shift.end_time
                          ),
                        0
                      )
                      .toFixed(1)}
                    h
                  </strong>
                </div>

                <div className="stat">
                  <span>{t.thisMonth}</span>
                  <strong>
                    {shifts
                      .filter((shift) => {
                        if (
                          shift.profiles?.id !==
                          selectedEmployee.id
                        ) {
                          return false;
                        }

                        if (shift.status !== 'approved') {
                          return false;
                        }

                        return shift.date.startsWith(
                          today().slice(0, 7)
                        );
                      })
                      .reduce(
                        (total, shift) =>
                          total +
                          duration(
                            shift.start_time,
                            shift.end_time
                          ),
                        0
                      )
                      .toFixed(1)}
                    h
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: '28px' }}>
                <p className="eyebrow">{t.history}</p>

                <h2 style={{ marginTop: '6px' }}>
                  {t.recentShifts}
                </h2>

                {shifts.filter(
                  (shift) =>
                    shift.profiles?.id === selectedEmployee.id &&
                    shift.status === 'approved' &&
                    shift.date < today()
                ).length === 0 ? (
                  <div className="empty">{t.noHistory}</div>
                ) : (
                  <div className="mini-list">
                    {shifts
                      .filter(
                        (shift) =>
                          shift.profiles?.id === selectedEmployee.id &&
                          shift.status === 'approved' &&
                          shift.date < today()
                      )
                      .sort((a, b) => {
                        const first = `${a.date} ${a.start_time}`;
                        const second = `${b.date} ${b.start_time}`;
                        return second.localeCompare(first);
                      })
                      .slice(0, 10)
                      .map((shift) => (
                        <div className="mini-row" key={shift.id}>
                          <div>
                            <strong>{formatDate(shift.date, language)}</strong>
                            <span>
                              {shift.start_time.slice(0, 5)} – {shift.end_time.slice(0, 5)}
                            </span>
                            <span>{shift.locations?.name || '-'}</span>
                          </div>
                          <strong>
                            {duration(shift.start_time, shift.end_time).toFixed(1)} {t.hour}
                          </strong>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: '28px',
                }}
              >
                <p className="eyebrow">
                  {t.upcoming}
                </p>

                <h2
                  style={{
                    marginTop: '6px',
                  }}
                >
                  {t.planned}
                </h2>

                {shifts.filter(
                  (shift) =>
                    shift.profiles?.id ===
                      selectedEmployee.id &&
                    shift.date >= today()
                ).length === 0 ? (
                  <div className="empty">
                    {t.noUpcoming}
                  </div>
                ) : (
                  <div className="mini-list">
                    {shifts
                      .filter(
                        (shift) =>
                          shift.profiles?.id ===
                            selectedEmployee.id &&
                          shift.date >= today()
                      )
                      .sort((a, b) => {
                        const first =
                          `${a.date} ${a.start_time}`;

                        const second =
                          `${b.date} ${b.start_time}`;

                        return first.localeCompare(
                          second
                        );
                      })
                      .slice(0, 10)
                      .map((shift) => (
                        <div
                          className="mini-row"
                          key={shift.id}
                        >
                          <div>
                            <strong>
                              {shift.date}
                            </strong>

                            <span>
                              {shift.start_time.slice(
                                0,
                                5
                              )}{' '}
                              –{' '}
                              {shift.end_time.slice(
                                0,
                                5
                              )}
                            </span>

                            <span>
                              {shift.locations?.name ||
                                '-'}
                            </span>
                          </div>

                          <em
                            className={
                              shift.status ===
                              'approved'
                                ? 'approved'
                                : shift.status ===
                                  'rejected'
                                ? 'rejected'
                                : 'pending'
                            }
                          >
                            {statusText(
                              shift.status
                            )}
                          </em>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* ADMIN PANEL KAPANIŞI */}
      </div>
    </main>
  );
}

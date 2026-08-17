import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { authAPI } from '../../api/api'
import { Logo } from '../../components/Logo'
import './Forgotpassword.css'

const TEXTS = {
  eyebrow: { en: 'Account recovery', kh: 'ការស្តារគណនីឡើងវិញ' },
  title1: { en: 'Locked out? ', kh: 'ជាប់គាំង? ' },
  titleHighlight: { en: "We'll get you back in", kh: 'យើងនឹងជួយអ្នកចូលវិញ' },
  subtitle: { en: "Enter your phone number and we'll send you a one-time code to reset your password.", kh: 'បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក ហើយយើងនឹងផ្ញើលេខកូដម្តងដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ។' },
  heading: { en: 'Forgot your password?', kh: 'ភ្លេចពាក្យសម្ងាត់?' },
  backToLogin: { en: 'back to login', kh: 'ត្រលប់ទៅចូលគណនី' },
  noWorries: { en: 'No worries — ', kh: 'កុំបារម្ភ — ' },
  phoneLabel: { en: 'Phone number', kh: 'លេខទូរស័ព្ទ' },
  phonePlaceholder: { en: '012 345 678', kh: '០១២ ៣៤៥ ៦៧៨' },
  sendOtp: { en: 'Send OTP', kh: 'ផ្ញើលេខកូដ' },
  // Step 2: OTP
  enterOtp: { en: 'Enter OTP Code', kh: 'បញ្ចូលលេខកូដ OTP' },
  otpSentTo: { en: 'We sent a 6‑digit code to ', kh: 'យើងបានផ្ញើលេខកូដ ៦ខ្ទង់ទៅកាន់ ' },
  verifyOtp: { en: 'Verify OTP', kh: 'ផ្ទៀងផ្ទាត់លេខកូដ' },
  resendOtp: { en: 'Resend code', kh: 'ផ្ញើលេខកូដម្តងទៀត' },
  changePhone: { en: 'Change phone number', kh: 'ផ្លាស់ប្តូរលេខទូរស័ព្ទ' },
  // Step 3: New password
  newPasswordTitle: { en: 'Set new password', kh: 'កំណត់ពាក្យសម្ងាត់ថ្មី' },
  newPasswordLabel: { en: 'New password', kh: 'ពាក្យសម្ងាត់ថ្មី' },
  newPasswordPlaceholder: { en: 'Create a new password', kh: 'បង្កើតពាក្យសម្ងាត់ថ្មី' },
  confirmLabel: { en: 'Confirm password', kh: 'បញ្ជាក់ពាក្យសម្ងាត់' },
  confirmPlaceholder: { en: 'Re-enter your password', kh: 'បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត' },
  resetBtn: { en: 'Reset Password', kh: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ' },
  passwordMismatch: { en: "Passwords don't match", kh: 'ពាក្យសម្ងាត់មិនត្រូវគ្នា' },
  // Success
  successTitle: { en: 'Password updated!', kh: 'ពាក្យសម្ងាត់បានធ្វើបច្ចុប្បន្នភាព!' },
  successText: { en: 'Your password has been reset. You can now log in with your new password.', kh: 'ពាក្យសម្ងាត់របស់អ្នកត្រូវបានកំណត់ឡើងវិញ។ អ្នកអាចចូលគណនីដោយប្រើពាក្យសម្ងាត់ថ្មីរបស់អ្នក។' },
  goToLogin: { en: 'Go to Login', kh: 'ទៅចូលគណនី' },
}

export const ForgotPassword = () => {
  const { lang } = useLanguage()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [error, setError] = useState('')

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await authAPI.sendForgotPasswordOtp(phone)
      setStep(2)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    try {
      await authAPI.sendForgotPasswordOtp(phone)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await authAPI.verifyForgotPasswordOtp(phone, otp)
      setResetToken(res.data.resetToken)
      setStep(3)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert(TEXTS.passwordMismatch[lang])
      return
    }
    setError('')
    try {
      await authAPI.resetPassword(resetToken, newPassword, confirmPassword)
      setStep(4)
    } catch (err) {
      setError(err.message)
    }
  }

  const goToStep = (s) => {
    setStep(s)
    if (s === 1) { setOtp(''); setNewPassword(''); setConfirmPassword('') }
  }

  return (
    <div className="auth">
      <div className="auth-panel">
        <div className="auth-panel-top">
          <Logo />
        </div>
        <div className="auth-panel-body">
          <span className="auth-panel-eyebrow">{TEXTS.eyebrow[lang]}</span>
          <h2 className="auth-panel-title">
            {TEXTS.title1[lang]}<span>{TEXTS.titleHighlight[lang]}</span>
          </h2>
          <p className="auth-panel-subtitle">{TEXTS.subtitle[lang]}</p>
        </div>
        <div className="auth-panel-blob" />
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-logo">
            <Logo />
          </div>

          {/* Step progress */}
          <div className="forgot-steps">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`forgot-step ${s < step ? 'forgot-step--done' : ''} ${s === step ? 'forgot-step--active' : ''}`}>
                <span className="forgot-step-dot">{s < step ? <CheckSmallIcon /> : s}</span>
                <span className={`forgot-step-label ${s === step ? '' : 'forgot-step-label--dim'}`}>
                  {s === 1 ? (lang === 'en' ? 'Phone' : 'ទូរស័ព្ទ') : s === 2 ? 'OTP' : (lang === 'en' ? 'Reset' : 'កំណត់')}
                </span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <h1 className="auth-title">{TEXTS.heading[lang]}</h1>
              <p className="auth-subtitle">
                {TEXTS.noWorries[lang]}<Link to="/login">{TEXTS.backToLogin[lang]}</Link>
              </p>
              <form className="auth-form" onSubmit={handleSendOtp}>
                <div className="field">
                  <label htmlFor="phone">{TEXTS.phoneLabel[lang]}</label>
                  <input id="phone" name="phone" type="tel" placeholder={TEXTS.phonePlaceholder[lang]} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-submit">{TEXTS.sendOtp[lang]}</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="auth-title">{TEXTS.enterOtp[lang]}</h1>
              <p className="auth-subtitle">
                {TEXTS.otpSentTo[lang]}<strong>{phone}</strong>
              </p>
              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <div className="field">
                  <label htmlFor="otp">{TEXTS.enterOtp[lang]}</label>
                  <input id="otp" name="otp" type="text" inputMode="numeric" maxLength={6} placeholder="000000" className="forgot-otp-input" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required autoFocus />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-submit">{TEXTS.verifyOtp[lang]}</button>

                <div className="forgot-otp-links">
                  <button type="button" className="forgot-link-btn" onClick={() => goToStep(1)}>{TEXTS.changePhone[lang]}</button>
                  <button type="button" className="forgot-link-btn" onClick={handleResendOtp}>{TEXTS.resendOtp[lang]}</button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="auth-title">{TEXTS.newPasswordTitle[lang]}</h1>
              <form className="auth-form" onSubmit={handleReset}>
                <div className="field">
                  <label htmlFor="newPassword">{TEXTS.newPasswordLabel[lang]}</label>
                  <input id="newPassword" name="newPassword" type="password" placeholder={TEXTS.newPasswordPlaceholder[lang]} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="confirmPassword">{TEXTS.confirmLabel[lang]}</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" placeholder={TEXTS.confirmPlaceholder[lang]} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-submit">{TEXTS.resetBtn[lang]}</button>
              </form>
            </>
          )}

          {step === 4 && (
            <div className="reset-sent">
              <div className="reset-sent-icon">
                <ShieldCheckIcon />
              </div>
              <h1 className="auth-title">{TEXTS.successTitle[lang]}</h1>
              <p className="auth-subtitle">{TEXTS.successText[lang]}</p>
              <Link to="/login" className="btn-submit" style={{ display: 'flex', textDecoration: 'none', justifyContent: 'center' }}>{TEXTS.goToLogin[lang]}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const CheckSmallIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

export default ForgotPassword

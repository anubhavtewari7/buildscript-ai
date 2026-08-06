import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPrivacy: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-white font-black text-sm uppercase tracking-widest mt-8 mb-3 pb-2 border-b border-slate-800">
      {children}
    </h2>
  );

  const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-slate-200 font-black text-xs uppercase tracking-wider mt-5 mb-2">
      {children}
    </h3>
  );

  const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-slate-400 text-xs leading-relaxed font-medium mb-3">
      {children}
    </p>
  );

  const effectiveDate = 'August 6, 2026';

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0a0a0f' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          paddingTop: 'max(20px, env(safe-area-inset-top, 20px))',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-white/80 hover:text-white transition-colors active:scale-90"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-white font-black text-base uppercase tracking-widest">
          Terms &amp; Privacy
        </h1>
      </div>

      {/* Intro banner */}
      <div className="mx-4 mt-5 rounded-2xl border border-purple-800/40 p-4" style={{ background: 'rgba(109,40,217,0.12)' }}>
        <p className="text-purple-300 font-black text-[10px] uppercase tracking-widest mb-1">Effective Date: {effectiveDate}</p>
        <p className="text-slate-300 text-xs leading-relaxed font-medium">
          Please read these Terms of Service and Privacy Policy carefully before using BuildScript AI. By accessing or using the app, you agree to be bound by these terms.
        </p>
      </div>

      <div className="px-5 pt-2">

        {/* ─── TERMS OF SERVICE ─── */}
        <div className="mt-6 mb-2">
          <div className="inline-block bg-purple-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
            Terms of Service
          </div>
        </div>

        <SectionTitle>1. Acceptance of Terms</SectionTitle>
        <Body>
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and BuildScript Inc. ("BuildScript," "we," "us," or "our"), a California corporation, governing your access to and use of the BuildScript AI mobile application and any related services (collectively, the "Service").
        </Body>
        <Body>
          By downloading, installing, creating an account, or otherwise using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference. If you do not agree to these Terms, do not access or use the Service.
        </Body>

        <SectionTitle>2. Eligibility</SectionTitle>
        <Body>
          You must be at least 13 years of age to use the Service. If you are under 18, you represent that you have obtained parental or guardian consent. By using the Service, you represent and warrant that you meet all applicable eligibility requirements and that all information you provide is accurate, current, and complete. We reserve the right to suspend or terminate accounts of users who provide false information or who we determine, in our sole discretion, do not meet the eligibility requirements.
        </Body>

        <SectionTitle>3. Description of Service</SectionTitle>
        <Body>
          BuildScript AI is an automotive information and AI-assistance application designed for iOS and Android devices. The Service provides AI-generated diagnostic information, vehicle modification guidance, OBD-II reference data, maintenance suggestions, virtual garage features, and related automotive content.
        </Body>
        <SubTitle>3.1 Not Professional Automotive Advice</SubTitle>
        <Body>
          THE SERVICE IS PROVIDED FOR INFORMATIONAL AND ENTERTAINMENT PURPOSES ONLY. THE AI-GENERATED CONTENT, DIAGNOSTICS, REPAIR SUGGESTIONS, AND MODIFICATION GUIDANCE PROVIDED THROUGH THE SERVICE ARE NOT PROFESSIONAL AUTOMOTIVE ADVICE, AND SHOULD NOT BE RELIED UPON AS A SUBSTITUTE FOR CONSULTATION WITH A LICENSED AUTOMOTIVE TECHNICIAN, ENGINEER, OR OTHER QUALIFIED PROFESSIONAL.
        </Body>
        <Body>
          BuildScript AI makes no representations or warranties regarding the accuracy, completeness, or suitability of any AI-generated content for any specific vehicle, purpose, or situation. Automotive repair, modification, and maintenance involve significant safety risks. You assume full responsibility for any actions taken based on information obtained through the Service, including any damage to property, personal injury, or death that may result.
        </Body>
        <SubTitle>3.2 No Warranty of Fitness</SubTitle>
        <Body>
          We do not warrant that the Service is fit for any particular purpose, including diagnosing specific vehicle issues, passing safety inspections, complying with local laws or emissions standards, or achieving any particular performance outcome. Regulations governing vehicle modifications vary by jurisdiction; you are solely responsible for compliance with all applicable laws.
        </Body>

        <SectionTitle>4. User Accounts</SectionTitle>
        <Body>
          To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account at support@buildscript.app.
        </Body>
        <Body>
          We reserve the right to terminate or suspend your account at any time for any reason, including but not limited to violation of these Terms, fraudulent activity, or extended inactivity, with or without notice.
        </Body>

        <SectionTitle>5. Subscription Plans and Payment Terms</SectionTitle>
        <SubTitle>5.1 Subscription Tiers</SubTitle>
        <Body>
          BuildScript AI offers multiple subscription tiers, including a free tier ("Standard") and paid tiers ("Builder" at $3.99/month and "Pro" at $9.99/month) as well as a one-time lifetime access option ("Lifetime" at $149.99). Feature availability varies by tier. Prices are subject to change with notice provided through the Service or to your registered email address.
        </Body>
        <SubTitle>5.2 Billing and Renewal</SubTitle>
        <Body>
          Paid subscriptions are billed in advance on a monthly basis. Your subscription will automatically renew at the end of each billing period unless you cancel prior to renewal. You authorize us to charge your payment method on file for all applicable subscription fees. All fees are stated in U.S. dollars and are exclusive of any applicable taxes, which are your responsibility.
        </Body>
        <SubTitle>5.3 Refund Policy</SubTitle>
        <Body>
          All purchases, including monthly subscriptions and lifetime access, are final and non-refundable except as required by applicable law or as expressly stated otherwise. If you believe you have been charged in error, you must contact us at support@buildscript.app within 30 days of the charge. For purchases made through Apple App Store or Google Play Store, their respective refund policies apply. We do not process refunds for charges made through third-party platforms; you must contact the applicable platform directly.
        </Body>
        <SubTitle>5.4 Cancellation</SubTitle>
        <Body>
          You may cancel your subscription at any time through the app settings or by contacting us at support@buildscript.app. Cancellation takes effect at the end of the current billing period; you retain access to paid features until that date. We do not provide prorated refunds for unused portions of a subscription period.
        </Body>
        <SubTitle>5.5 Free Tier</SubTitle>
        <Body>
          The free Standard tier is provided at no charge and is subject to feature limitations as described in the app. We reserve the right to modify or discontinue the free tier at any time with reasonable notice.
        </Body>

        <SectionTitle>6. Prohibited Uses</SectionTitle>
        <Body>
          You agree not to use the Service to: (a) violate any applicable federal, state, local, or international law or regulation; (b) engage in any activity that is harmful, threatening, abusive, harassing, defamatory, obscene, or otherwise objectionable; (c) impersonate any person or entity or falsely state or misrepresent your affiliation; (d) transmit any unsolicited commercial communications; (e) attempt to gain unauthorized access to any part of the Service or its related systems; (f) use automated means (bots, scrapers, spiders) to access or collect data from the Service without our express written permission; (g) reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Service; (h) use the Service in connection with any vehicle modification that is illegal in your jurisdiction, including emissions-defeating modifications; (i) distribute, resell, or sublicense access to the Service; or (j) introduce any malicious code, virus, or harmful components into the Service.
        </Body>

        <SectionTitle>7. Intellectual Property</SectionTitle>
        <Body>
          The Service and all content, features, and functionality thereof, including but not limited to all information, software, text, displays, images, video, audio, and the design, selection, and arrangement thereof, are owned by BuildScript Inc., its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </Body>
        <Body>
          BuildScript Inc. grants you a limited, non-exclusive, non-transferable, revocable license to use the Service for your personal, non-commercial purposes in accordance with these Terms. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any material from the Service except as permitted herein.
        </Body>
        <Body>
          User-submitted content (such as vehicle information, photos, or documents you upload to the app) remains your property. By submitting content, you grant BuildScript Inc. a worldwide, royalty-free, non-exclusive license to use, store, and process such content solely for the purpose of providing the Service to you.
        </Body>

        <SectionTitle>8. Disclaimer of Warranties</SectionTitle>
        <Body>
          THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. BUILDSCRIPT INC. DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, OR USEFULNESS OF ANY INFORMATION OBTAINED THROUGH THE SERVICE.
        </Body>

        <SectionTitle>9. Limitation of Liability</SectionTitle>
        <Body>
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BUILDSCRIPT INC., ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, PERSONAL INJURY, PROPERTY DAMAGE, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF, OR INABILITY TO USE, THE SERVICE OR ANY CONTENT OBTAINED THROUGH THE SERVICE, REGARDLESS OF THE CAUSE OF ACTION AND EVEN IF BUILDSCRIPT INC. HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </Body>
        <Body>
          IN NO EVENT SHALL BUILDSCRIPT INC.'S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO BUILDSCRIPT INC. IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100.00). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS OF LIABILITY; IN SUCH JURISDICTIONS, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </Body>

        <SectionTitle>10. Indemnification</SectionTitle>
        <Body>
          You agree to defend, indemnify, and hold harmless BuildScript Inc. and its affiliates, officers, directors, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to: (a) your violation of these Terms; (b) your use of the Service, including any vehicle repairs, modifications, or other actions you take based on information obtained through the Service; (c) your violation of any third-party rights, including intellectual property rights; or (d) any content you submit to the Service.
        </Body>

        <SectionTitle>11. Dispute Resolution and Arbitration</SectionTitle>
        <SubTitle>11.1 Mandatory Arbitration</SubTitle>
        <Body>
          PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT. You and BuildScript Inc. agree that any dispute, claim, or controversy arising out of or relating to these Terms or the Service (collectively, "Disputes") will be resolved by binding arbitration, except that either party may bring an individual action in small claims court for disputes within that court's jurisdiction. You waive any right to a jury trial with respect to any Dispute.
        </Body>
        <SubTitle>11.2 Class Action Waiver</SubTitle>
        <Body>
          YOU AND BUILDSCRIPT INC. AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION. Unless both parties agree otherwise, the arbitrator may not consolidate more than one person's claims and may not preside over any form of a representative or class proceeding.
        </Body>
        <SubTitle>11.3 Arbitration Procedure</SubTitle>
        <Body>
          Arbitration shall be conducted by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules, as modified by these Terms. The arbitration will be conducted in Los Angeles County, California, or by telephone or video conference at your election. The arbitrator's award shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.
        </Body>
        <SubTitle>11.4 Governing Law</SubTitle>
        <Body>
          These Terms and any Disputes shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions, except to the extent that federal law applies. For any claim not subject to arbitration, you submit to the exclusive jurisdiction of the state and federal courts located in Los Angeles County, California.
        </Body>

        <SectionTitle>12. Modifications to Terms</SectionTitle>
        <Body>
          We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by updating the effective date at the top of this document and, where appropriate, by sending notice to your registered email address or through an in-app notification. Your continued use of the Service after any modification constitutes your acceptance of the updated Terms.
        </Body>

        <SectionTitle>13. Termination</SectionTitle>
        <Body>
          We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including intellectual property provisions, warranty disclaimers, limitations of liability, and dispute resolution provisions.
        </Body>

        {/* ─── PRIVACY POLICY ─── */}
        <div className="mt-10 mb-2">
          <div className="inline-block bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
            Privacy Policy
          </div>
        </div>

        <SectionTitle>14. Privacy Policy Overview</SectionTitle>
        <Body>
          This Privacy Policy describes how BuildScript Inc. ("we," "us," or "our") collects, uses, stores, and discloses information about you when you use the BuildScript AI mobile application. This policy applies to all users, including users in California whose rights are further described below.
        </Body>

        <SectionTitle>15. Information We Collect</SectionTitle>
        <SubTitle>15.1 Information You Provide Directly</SubTitle>
        <Body>
          We collect information you provide when you create an account or use the Service, including: full name; email address; phone number (optional); vehicle information you enter (make, model, year, VIN, modifications); documents you upload (such as driver's license, insurance card, or vehicle registration); payment information (processed by our third-party payment processor; we do not store full card numbers); and communications you send to us.
        </Body>
        <SubTitle>15.2 Information Collected Automatically</SubTitle>
        <Body>
          When you use the Service, we automatically collect certain information, including: device identifiers (device type, operating system, unique device ID); app usage data (features accessed, session duration, interactions with AI); diagnostic trouble codes or vehicle data you input; crash reports and performance data; IP address and general location (derived from IP, not GPS unless you grant permission); and push notification tokens.
        </Body>
        <SubTitle>15.3 Information from Third-Party Services</SubTitle>
        <Body>
          We use Firebase (provided by Google LLC) for authentication, database storage, analytics, and cloud messaging. Firebase may collect additional data as described in Google's Privacy Policy (policies.google.com/privacy). If you authenticate using a third-party provider (e.g., Google Sign-In), we receive basic profile information (name, email, profile photo) from that provider as permitted by your settings.
        </Body>

        <SectionTitle>16. How We Use Your Information</SectionTitle>
        <Body>
          We use the information we collect to: provide, maintain, and improve the Service; personalize your experience and deliver AI-powered features; process transactions and manage your subscription; send transactional communications (account confirmations, receipts, security alerts); send promotional communications (with your consent, which you may withdraw at any time); respond to your inquiries and provide customer support; monitor and analyze usage patterns to improve the Service; detect, investigate, and prevent fraudulent or unauthorized activity; comply with legal obligations; and enforce these Terms.
        </Body>

        <SectionTitle>17. Sharing and Disclosure of Information</SectionTitle>
        <Body>
          We do not sell your personal information to third parties. We may share your information in the following circumstances:
        </Body>
        <Body>
          <strong className="text-slate-300">Service Providers:</strong> We share information with trusted third-party vendors who perform services on our behalf, including cloud infrastructure (Firebase/Google), payment processing, analytics, and customer support. These providers are contractually obligated to use your information only to perform services for us and to protect its confidentiality.
        </Body>
        <Body>
          <strong className="text-slate-300">Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
        </Body>
        <Body>
          <strong className="text-slate-300">Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or substantially all of our assets, your information may be transferred as part of that transaction. We will notify you before your personal information becomes subject to a different privacy policy.
        </Body>
        <Body>
          <strong className="text-slate-300">With Your Consent:</strong> We may share your information for other purposes with your explicit consent.
        </Body>

        <SectionTitle>18. Firebase and Google Services</SectionTitle>
        <Body>
          BuildScript AI relies on Firebase services provided by Google LLC, including Firebase Authentication, Cloud Firestore, Firebase Storage, and Firebase Analytics. Your data processed through Firebase is subject to Google's data processing terms and privacy policies. Firebase stores data on servers located in the United States and potentially other regions. By using the Service, you consent to the transfer and processing of your data by Firebase/Google as described herein. For more information, visit firebase.google.com/support/privacy.
        </Body>

        <SectionTitle>19. Data Retention</SectionTitle>
        <Body>
          We retain your personal information for as long as your account is active or as needed to provide the Service. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. If you request deletion of your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it by law.
        </Body>

        <SectionTitle>20. Data Security</SectionTitle>
        <Body>
          We implement commercially reasonable technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction, including encryption of data in transit (TLS) and at rest, access controls, and regular security assessments. However, no method of transmission over the internet or method of electronic storage is 100% secure. We cannot guarantee absolute security of your information and disclaim liability for any unauthorized access that is beyond our reasonable control.
        </Body>

        <SectionTitle>21. Children's Privacy (COPPA)</SectionTitle>
        <Body>
          The Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at legal@buildscript.app. We will promptly delete such information from our records. If we learn we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information as soon as reasonably practicable.
        </Body>
        <Body>
          Users between the ages of 13 and 17 may use the Service only with verifiable parental or guardian consent. Parents and guardians may contact us to review, modify, or delete information collected from a minor in their care.
        </Body>

        <SectionTitle>22. California Privacy Rights (CCPA / CPRA)</SectionTitle>
        <Body>
          If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):
        </Body>
        <SubTitle>Right to Know</SubTitle>
        <Body>
          You have the right to request that we disclose what personal information we collect, use, disclose, sell, or share about you, including the categories of personal information, the categories of sources, the business or commercial purposes for collection, and the categories of third parties with whom we share it.
        </Body>
        <SubTitle>Right to Delete</SubTitle>
        <Body>
          You have the right to request deletion of personal information we have collected from you, subject to certain exceptions. To request deletion of your data, go to Profile &gt; My Account &gt; Contact Support or email legal@buildscript.app with the subject line "Data Deletion Request." We will respond within 45 days.
        </Body>
        <SubTitle>Right to Correct</SubTitle>
        <Body>
          You have the right to request correction of inaccurate personal information we maintain about you.
        </Body>
        <SubTitle>Right to Opt Out of Sale or Sharing</SubTitle>
        <Body>
          We do not sell or share personal information for cross-context behavioral advertising. If this practice changes, we will update this policy and provide an opt-out mechanism.
        </Body>
        <SubTitle>Right to Limit Use of Sensitive Personal Information</SubTitle>
        <Body>
          To the extent we collect sensitive personal information (as defined by CPRA), you have the right to limit its use to purposes necessary to provide the Service.
        </Body>
        <SubTitle>Non-Discrimination</SubTitle>
        <Body>
          We will not discriminate against you for exercising your CCPA/CPRA rights. To submit a privacy request, email legal@buildscript.app or contact us through the Support menu in the app. We may need to verify your identity before processing your request.
        </Body>

        <SectionTitle>23. Your Choices and Controls</SectionTitle>
        <Body>
          You may update your account information at any time through Profile &gt; Edit Profile. You may opt out of promotional emails by following the unsubscribe link in any such communication. You may request deletion of your account and associated data by contacting us at legal@buildscript.app. You may disable push notifications through your device settings. Note that opting out of certain data processing may limit the functionality of the Service available to you.
        </Body>

        <SectionTitle>24. Third-Party Links and Services</SectionTitle>
        <Body>
          The Service may contain links to third-party websites or services that are not owned or controlled by BuildScript Inc. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. We strongly advise you to review the privacy policy of every third-party service you visit or use.
        </Body>

        <SectionTitle>25. Changes to This Privacy Policy</SectionTitle>
        <Body>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy within the app and updating the effective date. For significant changes affecting how we use your personal information, we will provide more prominent notice, which may include an in-app alert or email notification. Your continued use of the Service after the effective date of any changes constitutes your acceptance of the updated policy.
        </Body>

        <SectionTitle>26. Contact Us</SectionTitle>
        <Body>
          If you have questions, concerns, or requests regarding these Terms or our Privacy Policy, please contact us at:
        </Body>

        <div className="rounded-2xl border border-slate-800 p-5 mb-6" style={{ background: '#12121a' }}>
          <p className="text-white font-black text-sm mb-1">BuildScript Inc.</p>
          <p className="text-slate-400 text-xs font-medium mb-0.5">Legal &amp; Privacy Inquiries</p>
          <a href="mailto:legal@buildscript.app" className="text-purple-400 font-black text-xs">
            legal@buildscript.app
          </a>
          <p className="text-slate-500 text-[10px] font-medium mt-3">
            California, United States
          </p>
          <p className="text-slate-600 text-[10px] mt-1">
            We aim to respond to all inquiries within 5 business days.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 pb-10 space-y-1 border-t border-slate-800">
          <p className="text-slate-600 text-[10px] font-bold pt-4">BuildScript Inc.</p>
          <p className="text-slate-700 text-[10px]">© 2026 BuildScript Inc. All rights reserved.</p>
          <p className="text-slate-700 text-[10px]">Effective: {effectiveDate}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacy;

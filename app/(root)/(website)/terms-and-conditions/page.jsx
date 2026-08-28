import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import Link from 'next/link'

const breadcrumb = {
    title: 'Terms & Conditions',
    links: [
        { label: 'Terms & Conditions' },
    ]
}

const Section = ({ number, title, children }) => (
    <div className='mt-10'>
        <h2 className='text-lg lg:text-xl font-semibold text-[var(--dark-red-2)] mb-3'>
            {number}. {title}
        </h2>
        <div className='space-y-3 text-base lg:text-[17px] leading-relaxed text-gray-700'>
            {children}
        </div>
    </div>
)

const TermsAndConditions = () => {
    return (
        <div>
            <WebsiteBreadcrumb props={breadcrumb} />
            <div className='website-gutter py-16 max-w-[1400px] mx-auto'>

                {/* Header */}
                <div className='border-b border-gray-200 pb-8'>
                    <h1 className='text-3xl lg:text-4xl font-semibold mb-2'>Terms & Conditions</h1>
                    <p className='text-sm text-gray-500'>Last Updated: July 22, 2026 &nbsp;|&nbsp; Effective Date: July 22, 2026</p>
                    <p className='mt-5 text-base lg:text-[17px] leading-relaxed text-gray-700'>
                        Welcome to <strong>Horticultural Development Centre</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or placing an order on{' '}
                        <strong>horticulturaldevelopmentcentre.com</strong> (the &quot;Website&quot;), you agree to be legally bound by these Terms &amp; Conditions
                        (&quot;Terms&quot;). Please read them carefully before using our services. If you do not agree with any part of
                        these Terms, please discontinue use of the Website immediately.
                    </p>
                    <p className='mt-3 text-base lg:text-[17px] leading-relaxed text-gray-700'>
                        These Terms apply to all visitors, customers, and other users of the Website regardless of their location.
                    </p>
                </div>

                {/* Section 1 */}
                <Section number="1" title="Company Information">
                    <p>
                        <strong>Business Name:</strong> Horticultural Development Centre<br />
                        <strong>Registered Address:</strong> 2/5 Judges Court Road, Alipore, Kolkata, West Bengal, India – 700027<br />
                        <strong>Email:</strong>{' '}
                        <a href="mailto:horticulturaldc@gmail.com" className='text-[var(--dark-red-2)] underline underline-offset-2'>
                            horticulturaldc@gmail.com
                        </a><br />
                        <strong>Phone:</strong>{' '}
                        <a href="tel:+919088275576" className='text-[var(--dark-red-2)] underline underline-offset-2'>
                            +91 90882 75576
                        </a>
                    </p>
                </Section>

                {/* Section 2 */}
                <Section number="2" title="Eligibility & Account Registration">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>You must be at least 18 years old to create an account or make a purchase. Users between 13–17 may browse with verifiable parental or guardian consent and supervision.</li>
                        <li>By registering, you represent that all information you provide is accurate, current, and complete.</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately at <a href="mailto:horticulturaldc@gmail.com" className='text-[var(--dark-red-2)] underline underline-offset-2'>horticulturaldc@gmail.com</a> if you suspect unauthorized access.</li>
                        <li>We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.</li>
                        <li>One account per person. Creating multiple accounts to abuse promotions or discounts is strictly prohibited.</li>
                    </ul>
                </Section>

                {/* Section 3 */}
                <Section number="3" title="Products, Pricing & Availability">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>All plants, materials and services listed on this Website are subject to availability. Living stock is seasonal - seedlings of winter flowers are generally available August to December and seeds of summer flowers February to May - and we reserve the right to withdraw any item without prior notice.</li>
                        <li>Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
                        <li><strong>Living material varies.</strong> Plants are grown, not manufactured. Height, spread, canopy shape, leaf colour, flowering stage and pot finish will differ from the photographs shown, and will continue to change after delivery. Such natural variation is not a defect.</li>
                        <li>Landscaping, garden development, maintenance and consultancy are quoted separately after a site survey. Any indicative figure shown on this Website is not a binding quotation.</li>
                        <li>We reserve the right to correct pricing errors. If an item is listed at an incorrect price, we will notify you before processing your order and give you the option to proceed at the correct price or cancel.</li>
                        <li>Promotional prices and discounts are valid only for the stated period and cannot be applied retroactively.</li>
                    </ul>
                </Section>

                {/* Section 4 */}
                <Section number="4" title="Orders & Contract of Sale">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>Placing an item in your cart does not constitute a binding order. A contract is formed only when you receive an order confirmation email from us.</li>
                        <li>We reserve the right to refuse or cancel any order at our sole discretion, including orders suspected of fraud, incorrect pricing, or stock unavailability. A full refund will be issued in such cases.</li>
                        <li>For plants raised or reserved specifically against your order, and for landscaping work, cancellations may not be accepted once propagation, lifting or site work has commenced.</li>
                        <li>You are responsible for providing accurate delivery details. We are not liable for non-delivery caused by incorrect addresses, nor for plant loss caused by a consignment left uncollected.</li>
                    </ul>
                </Section>

                {/* Section 5 */}
                <Section number="5" title="Payments">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>We accept payments via major credit/debit cards, UPI, net banking, and other methods displayed at checkout.</li>
                        <li>All transactions are processed through PCI-DSS compliant payment gateways. We do not store your full card details on our servers.</li>
                        <li>By submitting payment, you confirm that you are the authorized cardholder or account owner.</li>
                        <li>In the event of a payment dispute or chargeback initiated without first contacting us, we reserve the right to suspend your account pending resolution.</li>
                        <li>For international orders, your bank or card provider may charge foreign transaction fees. We are not responsible for such charges.</li>
                    </ul>
                </Section>

                {/* Section 6 */}
                <Section number="6" title="Delivery, Collection & Site Work">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>Delivery of plants and garden materials is offered within Kolkata and, by prior arrangement, elsewhere in West Bengal and across India. Delivery timelines are estimates, not guarantees.</li>
                        <li>Orders may also be collected from our sale counter at 2/5 Judges Court Road, Alipore, Kolkata 700027 during business hours.</li>
                        <li>Large consignments, mature trees, lawn grass and bulk manure are quoted with transport separately, as they require dedicated vehicles and loading assistance at the delivery point.</li>
                        <li>Delivery charges, where applicable, are displayed at checkout before payment.</li>
                        <li>Risk of loss or damage passes to you upon delivery. Please inspect living material in the presence of the delivery person; report any visible damage or plant loss within 24 hours, with photographs.</li>
                        <li>Someone must be present to receive plants. Living stock left unattended, in a sealed vehicle, or in full sun after delivery deteriorates quickly and cannot be claimed against.</li>
                        <li>For landscaping and maintenance work, you agree to provide safe site access, and access to water and power where the scope requires it. We are not responsible for delays caused by carriers, weather, natural disasters, or other events beyond our control.</li>
                    </ul>
                </Section>

                {/* Section 7 */}
                <Section number="7" title="Returns, Refunds & Exchanges">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li><strong>Non-living goods</strong> - pots, planters, implements, geotextile net, drain cell, pebbles and sealed packs of manure, seed or chemicals - may be returned within <strong>7 days</strong> of delivery if unused and in original, unopened condition.</li>
                        <li><strong>Living material</strong> - plants, seedlings, grass and saplings - cannot be returned once it has left our custody, because its condition depends entirely on the care it receives thereafter. Please raise any claim for material that arrives dead, broken or visibly diseased within <strong>24 hours</strong> of delivery, with photographs; we will replace it or refund it.</li>
                        <li>We do not guarantee that a plant will survive, flower or fruit after delivery. Establishment depends on watering, light, drainage, feeding and pest control at your site, which are outside our control. Plants installed and maintained by us under a maintenance contract are covered by the terms of that contract instead.</li>
                        <li>Seed and seedling germination rates vary with sowing time, medium and weather and are not warranted.</li>
                        <li>To raise a claim, contact us at <a href="mailto:horticulturaldc@gmail.com" className='text-[var(--dark-red-2)] underline underline-offset-2'>horticulturaldc@gmail.com</a> with your order number and photographs.</li>
                        <li>Approved refunds are processed within 5–10 business days to the original payment method.</li>
                        <li>Return transport costs are the customer&apos;s responsibility unless the return is due to our error (wrong item, or material despatched in poor condition).</li>
                        <li>Exchanges are subject to availability and season. If the item you want is out of season, a credit or refund will be offered.</li>
                        <li>
                            <strong>Consumer Protection Compliance:</strong> Our return policy is designed to comply with the Indian Consumer Protection Act 2019,
                            EU Consumer Rights Directive, UK Consumer Rights Act 2015, Australian Consumer Law, and US FTC guidelines on refunds and returns.
                            If your local consumer protection laws grant you stronger rights, those rights are not affected by these Terms.
                        </li>
                    </ul>
                </Section>

                {/* Section 8 */}
                <Section number="8" title="Intellectual Property">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>All content on this Website - including but not limited to text, graphics, logos, photographs, designs, product names, and software - is the exclusive property of Horticultural Development Centre and is protected under applicable Indian and international copyright, trademark, and intellectual property laws.</li>
                        <li>You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content without our prior written consent.</li>
                        <li>Limited, non-exclusive, non-transferable permission is granted to access and use this Website for personal, non-commercial shopping purposes only.</li>
                        <li>Any unauthorized use may result in legal action under the Copyright Act 1957 (India) and equivalent international statutes.</li>
                    </ul>
                </Section>

                {/* Section 9 */}
                <Section number="9" title="User Conduct & Prohibited Activities">
                    <p>You agree not to:</p>
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>Use the Website for any unlawful, fraudulent, or malicious purpose.</li>
                        <li>Attempt to gain unauthorized access to our systems, servers, or databases.</li>
                        <li>Transmit viruses, malware, or any other harmful code.</li>
                        <li>Scrape, crawl, or data-mine the Website without express written permission.</li>
                        <li>Post or transmit content that is defamatory, harassing, obscene, or infringes on any third party&apos;s rights.</li>
                        <li>Impersonate any person or entity or misrepresent your affiliation with Horticultural Development Centre.</li>
                        <li>Engage in any activity that interferes with or disrupts the Website&apos;s operation.</li>
                    </ul>
                </Section>

                {/* Section 10 */}
                <Section number="10" title="Privacy & Data Protection">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>Our collection and use of your personal data is governed by our{' '}
                            <Link href="/privacy-policy" className='text-[var(--dark-red-2)] underline underline-offset-2'>Privacy Policy</Link>,
                            which forms part of these Terms.
                        </li>
                        <li>
                            <strong>GDPR (EU/EEA Customers):</strong> If you are located in the European Union or European Economic Area, you have the right to access,
                            rectify, erase, restrict, or port your personal data, and to withdraw consent at any time. To exercise these rights, contact us at{' '}
                            <a href="mailto:horticulturaldc@gmail.com" className='text-[var(--dark-red-2)] underline underline-offset-2'>horticulturaldc@gmail.com</a>.
                        </li>
                        <li>
                            <strong>CCPA (California Customers):</strong> California residents have the right to know what personal information we collect, to request deletion,
                            and to opt out of the sale of personal information. We do not sell personal information to third parties.
                        </li>
                        <li>
                            <strong>India (DPDP Act 2023):</strong> We comply with the Digital Personal Data Protection Act 2023 and process your data lawfully,
                            fairly, and transparently.
                        </li>
                        <li>We use cookies and similar tracking technologies to improve your browsing experience. You may manage cookie preferences through your browser settings or our cookie consent banner.</li>
                    </ul>
                </Section>

                {/* Section 11 */}
                <Section number="11" title="Third-Party Links & Services">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>Our Website may contain links to third-party websites or services (e.g., payment processors, social media platforms). These links are provided for convenience only.</li>
                        <li>We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.</li>
                        <li>We encourage you to review the terms and privacy policies of any third-party services you access through our Website.</li>
                    </ul>
                </Section>

                {/* Section 12 */}
                <Section number="12" title="Disclaimer of Warranties">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>The Website and its content are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
                        <li>We do not warrant that the Website will be uninterrupted, error-free, or free of viruses or other harmful components.</li>
                        <li>Nothing in this clause affects your statutory rights as a consumer that cannot be excluded or limited by applicable law.</li>
                    </ul>
                </Section>

                {/* Section 13 */}
                <Section number="13" title="Limitation of Liability">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>To the fullest extent permitted by applicable law, Horticultural Development Centre, its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Website or products.</li>
                        <li>Our total liability to you for any claim arising out of or related to these Terms shall not exceed the total amount paid by you for the specific order giving rise to the claim.</li>
                        <li>These limitations do not apply to death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded under applicable law.</li>
                    </ul>
                </Section>

                {/* Section 14 */}
                <Section number="14" title="Indemnification">
                    <p>
                        You agree to indemnify, defend, and hold harmless Horticultural Development Centre and its officers, directors, employees, agents, and suppliers from and against any claims,
                        liabilities, damages, judgments, awards, losses, costs, or expenses (including reasonable legal fees) arising out of or relating to your violation of
                        these Terms or your use of the Website.
                    </p>
                </Section>

                {/* Section 15 */}
                <Section number="15" title="Governing Law & Jurisdiction">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</li>
                        <li>Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Kolkata, West Bengal, India.</li>
                        <li>If you are a consumer based in the EU, UK, or Australia, mandatory local consumer protection laws of your country may also apply and are not overridden by this clause.</li>
                    </ul>
                </Section>

                {/* Section 16 */}
                <Section number="16" title="Dispute Resolution">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>We encourage you to contact us first at <a href="mailto:horticulturaldc@gmail.com" className='text-[var(--dark-red-2)] underline underline-offset-2'>horticulturaldc@gmail.com</a> to resolve any dispute informally within 30 days.</li>
                        <li>If informal resolution is unsuccessful, disputes shall be settled by binding arbitration under the Arbitration and Conciliation Act 1996 (India), with a sole arbitrator mutually agreed upon.</li>
                        <li>EU customers may also use the EU Online Dispute Resolution platform at <strong>ec.europa.eu/consumers/odr</strong>.</li>
                        <li>Class action waiver: You agree to resolve disputes on an individual basis and waive the right to participate in class action lawsuits to the extent permitted by applicable law.</li>
                    </ul>
                </Section>

                {/* Section 17 */}
                <Section number="17" title="Force Majeure">
                    <p>
                        Horticultural Development Centre shall not be held liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to
                        natural disasters, pandemics, government actions, war, civil unrest, power failures, internet outages, or strikes.
                    </p>
                </Section>

                {/* Section 18 */}
                <Section number="18" title="Modifications to Terms">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>We reserve the right to amend these Terms at any time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date.</li>
                        <li>For material changes, we will notify registered users via email at least 14 days before the changes take effect.</li>
                        <li>Continued use of the Website after changes are posted constitutes your acceptance of the revised Terms.</li>
                    </ul>
                </Section>

                {/* Section 19 */}
                <Section number="19" title="Severability & Entire Agreement">
                    <ul className='list-disc ps-6 space-y-2'>
                        <li>If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will continue in full force and effect.</li>
                        <li>These Terms, together with our <Link href="/privacy-policy" className='text-[var(--dark-red-2)] underline underline-offset-2'>Privacy Policy</Link>, constitute the entire agreement between you and Horticultural Development Centre regarding your use of the Website.</li>
                    </ul>
                </Section>

                {/* Contact */}
                <div className='mt-12 border-t border-gray-200 pt-8'>
                    <h2 className='text-lg lg:text-xl font-semibold text-[var(--dark-red-2)] mb-3'>Contact Us</h2>
                    <p className='text-base lg:text-[17px] leading-relaxed text-gray-700'>
                        If you have any questions, concerns, or requests regarding these Terms &amp; Conditions, please reach out to us:
                    </p>
                    <ul className='mt-4 space-y-2 text-base lg:text-[17px] text-gray-700'>
                        <li><strong>Email:</strong>{' '}
                            <a href="mailto:horticulturaldc@gmail.com" className='text-[var(--dark-red-2)] underline underline-offset-2'>
                                horticulturaldc@gmail.com
                            </a>
                        </li>
                        <li><strong>Phone:</strong>{' '}
                            <a href="tel:+919088275576" className='text-[var(--dark-red-2)] underline underline-offset-2'>
                                +91 90882 75576
                            </a>
                        </li>
                        <li><strong>Address:</strong> Horticultural Development Centre, 2/5 Judges Court Road, Alipore, Kolkata, West Bengal, India – 700027</li>
                    </ul>
                    <p className='mt-6 text-sm text-gray-500'>
                        Thank you for choosing Horticultural Development Centre. We are committed to providing you with a safe, reliable, and enjoyable shopping experience.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default TermsAndConditions

import { PumpkinDocument } from '@/lib/api';

export const CATEGORIZED_TEMPLATES: Record<string, PumpkinDocument[]> = {
    'HR': [
        {
            id: 'hr-offer-letter',
            title: 'Employment Offer Letter',
            type: 'Template',
            category: 'HR',
            client: 'Candidate',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="text-align: right; margin-bottom: 40px;">
                        <p><strong>{{date}}</strong></p>
                    </div>
                    <h1>OFFER OF EMPLOYMENT</h1>
                    <p>Dear {{candidate_name}},</p>
                    <p>We are delighted to offer you the position of <strong>[Job Title]</strong> at <strong>{{company_name}}</strong>. We were extremely impressed with your experience and believe your skills will be instrumental in our mission to [Company Mission].</p>
                    
                    <h3>1. Position and Responsibilities</h3>
                    <p>In this role, you will report to <strong>[Manager Name]</strong>. Your primary responsibilities will include [Primary Responsibility 1], [Primary Responsibility 2], and [Primary Responsibility 3]. This is a [Full-time/Part-time] position.</p>
                    
                    <h3>2. Compensation and Benefits</h3>
                    <p><strong>Base Salary:</strong> Your starting gross base salary will be <strong>$[Amount]</strong> per annum, payable in semi-monthly installments, subject to standard payroll deductions.</p>
                    <p><strong>Stock Options:</strong> Subject to Board approval, you will be granted an option to purchase [Number] shares of {{company_name}} Common Stock, vesting over a four-year period with a one-year cliff.</p>
                    <p><strong>Benefits:</strong> You will be eligible for our comprehensive benefits package, including medical, dental, and vision insurance, 401(k) matching, and [X] weeks of paid time off (PTO) annually.</p>
                    
                    <h3>3. Term and Conditions</h3>
                    <p>This offer is contingent upon the successful completion of a background check and your ability to provide proof of eligibility to work in the United States. Please note that employment with {{company_name}} is "at-will," meaning either you or the Company may terminate the relationship at any time.</p>
                    
                    <h3>4. Acceptance</h3>
                    <p>To accept this offer, please sign and return this letter by <strong>[Offer Expiry Date]</strong>. We are excited about the prospect of you joining our team!</p>
                    
                    <div style="margin-top: 50px;">
                        <p>Sincerely,</p>
                        <p><strong>[Hiring Manager Name]</strong><br/>[Title]<br/>{{company_name}}</p>
                    </div>
                </div>
            `,
            header: '{{company_name}}<br/>Confidential HR Communication',
            footer: '{{company_name}} is an Equal Opportunity Employer.'
        },
        {
            id: 'hr-performance-review',
            title: 'Employee Performance Review',
            type: 'Template',
            category: 'HR',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Annual Performance Review</h1>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Employee:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">[Employee Name]</td>
                    </tr>
                </table>
                <h3>Core Competencies</h3>
                <p><strong>Quality of Work:</strong> [Comments]</p>
                <p><strong>Reliability:</strong> [Comments]</p>
                <p><strong>Collaboration:</strong> [Comments]</p>
            `,
            footer: 'Standard Performance Review Form - rev. 2024'
        },
        {
            id: 'hr-training-idp',
            title: 'Individual Development Plan (IDP)',
            type: 'Template',
            category: 'HR',
            client: 'Personnel / Training',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Employee Development Plan</h1>
                <p>Employee: [Name] | Manager: [Name]</p>
                <h3>1. Short-Term Goals (6-12 Months)</h3>
                <p>[List specific skills to acquire or projects to lead]</p>
                <h3>2. Long-Term Goals (2-5 Years)</h3>
                <p>[Describe the desired career trajectory]</p>
                <h3>3. Action Steps & Resources</h3>
                <ul>
                    <li>[ ] Training Course: [Name]</li>
                    <li>[ ] Mentorship with [Person]</li>
                </ul>
            `
        },
        {
            id: 'hr-conflict-mediation',
            title: 'HR: Conflict Mediation Record',
            type: 'Template',
            category: 'HR',
            client: 'Employee Relations',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Conflict Resolution & Mediation</h1>
                <p>Date: {{date}} | Mediator: [Name]</p>
                <h3>1. Involved Parties</h3>
                <p>Party A: [Name] | Party B: [Name]</p>
                <h3>2. Issue Summary</h3>
                <p>[Objective description of the disagreement]</p>
                <h3>3. Agreed Resolution</h3>
                <p>[What steps will both parties take to move forward?]</p>
                <hr/>
                <p>Party A Signature: _________ Party B Signature: _________</p>
            `
        },
        {
            id: 'hr-job-description',
            title: 'Standard Job Description Template',
            type: 'Template',
            category: 'HR',
            client: 'Talent Acquisition',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Job Description: [Job Title]</h1>
                <h3>Company Overview</h3>
                <p>{{company_name}} is a high-growth startup focused on [Brief Description]. We are looking for a motivated [Job Title] to join our team.</p>
                <h3>Responsibilities</h3>
                <ul>
                    <li>Develop and maintain [System/Process]</li>
                    <li>Collaborate with [Department] on [Objective]</li>
                    <li>Ensure high quality standards in [Task]</li>
                </ul>
                <h3>Requirements</h3>
                <ul>
                    <li>[X] years of experience in [Field]</li>
                    <li>Proficiency in [Tool/Language]</li>
                    <li>Strong communication and problem-solving skills</li>
                </ul>
            `
        },
        {
            id: 'hr-offboarding-checklist',
            title: 'Employee Departure Checklist',
            type: 'Template',
            category: 'HR',
            client: 'HR / Operations',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Employee Offboarding Checklist</h1>
                <p>Employee: [Name] | Exit Date: [Date]</p>
                <h3>1. Assets & Access</h3>
                <ul>
                    <li>[ ] Laptop and accessories returned</li>
                    <li>[ ] Security keys/badges returned</li>
                    <li>[ ] Deactivate email and Slack access</li>
                    <li>[ ] Remove from cloud permissions (AWS, GitHub, etc.)</li>
                </ul>
                <h3>2. Documentation</h3>
                <ul>
                    <li>[ ] Signed Resignation Letter</li>
                    <li>[ ] Exit Interview completed</li>
                    <li>[ ] Final payroll and vacation payout confirmed</li>
                </ul>
            `
        },
        {
            id: 'hr-direct-deposit',
            title: 'Payroll: Direct Deposit Authorization',
            type: 'Template',
            category: 'HR',
            client: 'Finance / Payroll',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Direct Deposit Authorization Form</h1>
                <p>I hereby authorize {{company_name}} to deposit my salary into the following account:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Bank Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">[Bank Name]</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Routing Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">[000000000]</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Account Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">[0000000000]</td></tr>
                </table>
                <p style="margin-top: 50px;">Signature: ______________________ Date: ___________</p>
            `
        },
        {
            id: 'hr-remote-work-policy',
            title: 'Workplace Policy: Remote Work',
            type: 'Template',
            category: 'HR',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>REMOTE WORK & HYBRID POLICY</h1>
                <p>Version: 2.0 | Effective Date: {{date}}</p>
                
                <h3>1. Introduction</h3>
                <p>{{company_name}} recognizes that flexible work arrangements can increase productivity, improve employee morale, and help us attract top talent. This policy defines the expectations for remote and hybrid work.</p>
                
                <h3>2. Work Schedule & Availability</h3>
                <p>Employees are expected to be available and responsive during our core business hours: <strong>10:00 AM to 4:00 PM [Timezone]</strong>. While we encourage flexibility, core collaboration periods are essential for team synchronization.</p>
                
                <h3>3. Communication & Tools</h3>
                <p>Remote employees must maintain active profiles on Slack and Zoom. All internal meetings should include a video link by default. Response times for "urgent" tagged messages should be within 30 minutes during core hours.</p>
                
                <h3>4. Information Security</h3>
                <ul>
                    <li>Use only company-provided, encrypted hardware for work tasks.</li>
                    <li>Maintain a secure home network with WPA2/WPA3 encryption.</li>
                    <li>Never use public, unsecured Wi-Fi for accessing company servers without a VPN.</li>
                    <li>Report any suspected security breaches immediately to IT Support.</li>
                </ul>
                
                <h3>5. Home Office Expense</h3>
                <p>{{company_name}} provides a one-time stipend of <strong>$[Amount]</strong> for home office setup (desk, chair, ergonomics). Monthly internet subsidies of $[Amount] are provided via payroll.</p>
                
                <p style="margin-top: 40px; font-style: italic;">By continuing to work remotely, you acknowledge that you have read and agree to comply with this policy.</p>
            `
        },
        {
            id: 'hr-benefits-summary',
            title: 'Benefits Administration: Summary',
            type: 'Template',
            category: 'HR',
            client: 'Internal / Benefits',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>EMPLOYEE BENEFITS OVERVIEW</h1>
                <p>This document provides a summary of the benefits available to full-time employees of <strong>{{company_name}}</strong>.</p>
                
                <h3>1. Health & Wellness</h3>
                <p><strong>Medical:</strong> 100% premium coverage for employees and 50% for dependents via [Insurance Provider]. Plans include PPO and HDHP/HSA options.</p>
                <p><strong>Mental Health:</strong> Access to [Provider Name] for up to 12 free therapy sessions per year.</p>
                
                <h3>2. Financial Security</h3>
                <p><strong>401(k) Plan:</strong> We match 100% of the first 3% and 50% of the next 2% of your contributions. Vesting is immediate.</p>
                <p><strong>Disability:</strong> Company-paid short-term and long-term disability insurance covering 60% of base salary.</p>
                
                <h3>3. Time Off</h3>
                <ul>
                    <li><strong>Flexible PTO:</strong> We do not track days; success is measured by output. Mandatory minimum 2 weeks off per year.</li>
                    <li><strong>Parental Leave:</strong> 16 weeks of fully paid leave for birth or adoption.</li>
                    <li><strong>Volunteer Days:</strong> 2 days per year for approved non-profit work.</li>
                </ul>
            `
        },
        {
            id: 'hr-labor-compliance',
            title: 'Compliance: Labor Law Notice',
            type: 'Template',
            category: 'HR',
            client: 'Legal / HR Compliance',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>ANNUAL LABOR LAW & COMPLIANCE NOTICE</h1>
                <p>This notice summarizes key rights and responsibilities under federal and state labor laws.</p>
                
                <h3>1. Equal Employment Opportunity (EEO)</h3>
                <p>{{company_name}} provides equal employment opportunities to all employees and applicants without regard to race, color, religion, sex, national origin, age, disability, or genetics.</p>
                
                <h3>2. Family and Medical Leave Act (FMLA)</h3>
                <p>Eligible employees may take up to 12 weeks of unpaid, job-protected leave for specified family and medical reasons.</p>
                
                <h3>3. Fair Labor Standards Act (FLSA)</h3>
                <p>Employees are classified as either Exempt or Non-Exempt. Non-Exempt employees are entitled to overtime pay at 1.5x their regular rate for hours worked over 40 in a workweek.</p>
                
                <h3>4. Workplace Safety (OSHA)</h3>
                <p>Under the Occupational Safety and Health Act, employees have the right to a safe workplace. Report all hazards to <strong>[Safety Officer Name]</strong> immediately.</p>
            `
        }
    ],
    'Ops': [
        {
            id: 'ops-sow',
            title: 'Project Statement of Work (SOW)',
            type: 'Template',
            category: 'Ops',
            client: 'Client Name',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>STATEMENT OF WORK (SOW)</h1>
                <p>Effective Date: {{date}} | SOW Reference: #SOW-[0001]</p>
                <hr/>
                <h3>1. Project Scope</h3>
                <p><strong>{{company_name}}</strong> (the "Service Provider") agrees to provide <strong>{{client_name}}</strong> (the "Client") with the following services:</p>
                <p>[Detailed description of the specific tasks, methodologies, and technical requirements. This section should leave no ambiguity regarding what is included in the project.]</p>
                
                <h3>2. Deliverables</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background: #f4f4f4;">
                        <th style="border: 1px solid #ddd; padding: 10px;">Deliverable</th>
                        <th style="border: 1px solid #ddd; padding: 10px;">Target Date</th>
                        <th style="border: 1px solid #ddd; padding: 10px;">Acceptance Criteria</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">Alpha Release</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">[Date]</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">Feature parity with spec.</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">Final Handover</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">[Date]</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">Bug-free production deploy.</td>
                    </tr>
                </table>
                
                <h3>3. Fees and Payment Schedule</h3>
                <p>Total consideration for the Services is <strong>$[Amount]</strong>. Payments will be invoiced as follows:</p>
                <ul>
                    <li>25% Deposit upon execution of SOW.</li>
                    <li>50% Upon Alpha Release.</li>
                    <li>25% Upon Final Handover.</li>
                </ul>
                
                <h3>4. Client Responsibilities</h3>
                <p>Client shall provide timely access to [Account/Data/Personnel] to ensure project timelines are met. Delays in Client response exceeding 48 hours may impact the Final Delivery date.</p>
            `,
            header: 'STATEMENT OF WORK<br/>Project: [Project Name]'
        },
        {
            id: 'ops-daily-log',
            title: 'Daily Business Ops Log',
            type: 'Template',
            category: 'Operations',
            client: 'Operations Manager',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Daily Operations Report</h1>
                <p>Date: {{date}} | Shift: [Morning/Evening]</p>
                <h3>1. Key Achievements</h3>
                <p>[What went well today?]</p>
                <h3>2. Incidents & Delays</h3>
                <p>[Any blockers or equipment failures?]</p>
                <h3>3. Goals for Tomorrow</h3>
                <ul>
                    <li>[Goal 1]</li>
                    <li>[Goal 2]</li>
                </ul>
            `
        },
        {
            id: 'ops-vendor-scorecard',
            title: 'Vendor Performance Scorecard',
            type: 'Template',
            category: 'Operations',
            client: 'Vendor Management',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Vendor Evaluation Card</h1>
                <p>Vendor: [Name] | Review Period: [Quarter]</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Criteria</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Score (1-5)</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Comments</th>
                    </tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">Delivery Reliability</td><td style="padding: 8px; border: 1px solid #ddd;">5</td><td style="padding: 8px; border: 1px solid #ddd;">Always on time</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">Quality of Goods</td><td style="padding: 8px; border: 1px solid #ddd;">4</td><td style="padding: 8px; border: 1px solid #ddd;">Minimal defects</td></tr>
                </table>
            `
        },
        {
            id: 'ops-purchase-order',
            title: 'Official Purchase Order (PO)',
            type: 'Template',
            category: 'Operations',
            client: 'Vendor Name',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Purchase Order: #PO-[0001]</h1>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Description</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Unit Price</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
                    </tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">[Item Name]</td><td style="padding: 8px; border: 1px solid #ddd;">[Qty]</td><td style="padding: 8px; border: 1px solid #ddd;">$[0.00]</td><td style="padding: 8px; border: 1px solid #ddd;">$[0.00]</td></tr>
                </table>
                <p style="text-align: right; font-weight: bold; margin-top: 10px;">GRAND TOTAL: $[0.00]</p>
            `,
            footer: 'Authorized Signature: ______________________'
        },
        {
            id: 'ops-inventory-log',
            title: 'Weekly Inventory Audit Log',
            type: 'Template',
            category: 'Operations',
            client: 'Warehouse / Storage',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Inventory Audit Log</h1>
                <p>Location: [Warehouse A] | Auditor: [Name]</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; border: 1px solid #ddd;">SKU</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Description</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">On Hand</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Condition</th>
                    </tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">[000]</td><td style="padding: 8px; border: 1px solid #ddd;">[Item]</td><td style="padding: 8px; border: 1px solid #ddd;">[0]</td><td style="padding: 8px; border: 1px solid #ddd;">[Good]</td></tr>
                </table>
            `
        },
        {
            id: 'ops-shipping-manifest',
            title: 'Logistics: Shipping Manifest',
            type: 'Template',
            category: 'Operations',
            client: 'Carrier / Logistics',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Shipping Manifest</h1>
                <p>Origin: {{company_address}} | Destination: [Client Address]</p>
                <h3>Shipment Details</h3>
                <ul>
                    <li><strong>Tracking #:</strong> [XXXXXXXXXXXX]</li>
                    <li><strong>Weight:</strong> [00] lbs</li>
                    <li><strong>Service:</strong> [Ground/Express]</li>
                </ul>
                <p>Receiver Print Name: ______________________ Date: ___________</p>
            `
        },
        {
            id: 'ops-emergency-protocol',
            title: 'Risk Mgmt: Emergency Protocol',
            type: 'Template',
            category: 'Operations',
            client: 'Internal / Safety',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Emergency Response Protocol</h1>
                <h3>1. Fire / Evacuation</h3>
                <p>Assemble at the designated meeting point: [Assembly Point A]. Do not use elevators.</p>
                <h3>2. Medical Emergency</h3>
                <p>Call [Local Emergency Number] and notify the on-site safety officer: [Name/Extension].</p>
                <h3>3. Critical Incident Comms</h3>
                <p>Contact Executive Leadership via the emergency Slack channel: #safety-alerts.</p>
            `
        },
        {
            id: 'ops-onboarding',
            title: 'Employee Onboarding SOP',
            type: 'Template',
            category: 'Operations',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Standard Operating Procedure: New Hire Onboarding</h1>
                <h3>1. Pre-Arrival Checklist</h3>
                <ul>
                    <li>[ ] Set up company email and Slack</li>
                    <li>[ ] Provision hardware (Laptop, Monitor)</li>
                    <li>[ ] Assign onboarding buddy</li>
                </ul>
                <h3>2. Day One Agenda</h3>
                <p>09:00 AM - Welcome & Office Tour<br/>10:30 AM - IT Setup & Security Briefing<br/>12:00 PM - Team Lunch</p>
                <h3>3. Week One Objectives</h3>
                <p>[List key learning objectives and meetings]</p>
            `
        }
    ],
    'Marketing': [
        {
            id: 'marketing-brief',
            title: 'Campaign Creative Brief',
            type: 'Template',
            category: 'Marketing',
            client: 'Marketing Team',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>CREATIVE BRIEF: [CAMPAIGN NAME]</h1>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9; width: 30%;"><strong>Launch Date:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px;">[Date]</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;"><strong>Budget:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px;">$[Amount]</td>
                    </tr>
                </table>

                <h3>1. Background & Context</h3>
                <p>[Explain the business problem we are trying to solve. Why is this campaign necessary now?]</p>
                
                <h3>2. Target Audience (Persona)</h3>
                <p><strong>Primary Audience:</strong> [e.g., Tech-savvy founders, ages 25-45, in North America]</p>
                <p><strong>Pain Points:</strong> [List 3 key struggles they face that we solve]</p>
                
                <h3>3. The Big Idea & Key Message</h3>
                <p style="font-size: 1.2em; font-weight: bold; color: #000; background: #fff8e1; padding: 15px; border-left: 5px solid #ffc107;">"[The single most important takeaway for the audience]"</p>
                
                <h3>4. Deliverables & Channels</h3>
                <ul>
                    <li><strong>Social:</strong> [X] Grid posts, [Y] Reels</li>
                    <li><strong>Email:</strong> [Z] Sequential drips</li>
                    <li><strong>Web:</strong> [Link] Landing page</li>
                </ul>
                
                <h3>5. Success Metrics (KPIs)</h3>
                <p>[How will we know this worked? e.g., 500 new trials, 50% CTR improvement]</p>
            `
        },
        {
            id: 'marketing-newsletter',
            title: 'Marketing: Email Newsletter Template',
            type: 'Template',
            category: 'Marketing',
            client: 'Subscribers',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <div style="background: #f9f9f9; padding: 20px;">
                    <h1 style="text-align: center;">{{company_name}} Monthly Update</h1>
                    <p>Hi [User],</p>
                    <p>Welcome to our latest edition. This month, we're exciting to share [Major Update].</p>
                    <div style="background: white; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <h3>Featured Article: [Title]</h3>
                        <p>[Brief summary of the article content to drive engagement]</p>
                        <p><a href="#">Read More...</a></p>
                    </div>
                </div>
            `
        },
        {
            id: 'marketing-brand-strategy',
            title: 'Brand Identity & Strategy',
            type: 'Template',
            category: 'Marketing',
            client: 'Brand Team',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>BRAND IDENTITY & STRATEGIC GUIDELINES</h1>
                <p>Establishing a consistent brand experience for <strong>{{company_name}}</strong>.</p>
                
                <h3>1. Core Purpose (The 'Why')</h3>
                <p><strong>Mission Statement:</strong> [Our reason for existing beyond profit]</p>
                <p><strong>Values:</strong> [e.g., Radical Transparency, Quality First, User Obsession]</p>
                
                <h3>2. Competitive Positioning</h3>
                <p><strong>Our Unique Value Prop (UVP):</strong> [What makes us different from Competitor X?]</p>
                <div style="background: #f0f7ff; padding: 15px; border: 1px dashed #007bff; margin: 10px 0;">
                    <p><strong>Emotional Benefit:</strong> [How do users FEEL when using our product?]</p>
                </div>
                
                <h3>3. Voice & Tone</h3>
                <p>Our brand voice is <strong>[Professional yet Playful / Authoritative / Minimalist]</strong>.</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #eef;">
                        <td style="padding: 10px; border: 1px solid #ccc;"><strong>We Are...</strong></td>
                        <td style="padding: 10px; border: 1px solid #ccc;"><strong>We Are NOT...</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc;">Helpful and clear</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">Condescending or verbose</td>
                    </tr>
                </table>
                
                <h3>4. Visual Identity</h3>
                <p><strong>Typography:</strong> Primary: [Font Name] | Secondary: [Font Name]</p>
                <div style="display: flex; gap: 10px; margin: 20px 0;">
                    <div style="width: 50px; height: 50px; background: #000; display: flex; align-items: center; justify-content: center; color: white; border-radius: 4px;">#000</div>
                    <div style="width: 50px; height: 50px; background: #primary; display: flex; align-items: center; justify-content: center; color: white; border-radius: 4px;">[Primary]</div>
                </div>
            `
        },
        {
            id: 'marketing-content-calendar',
            title: 'Social Media Content Calendar',
            type: 'Template',
            category: 'Marketing',
            client: 'Digital Marketing',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Content Calendar: [Month] [Year]</h1>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Channel</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Content Type</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Status</th>
                    </tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">[Mon 1st]</td><td style="padding: 8px; border: 1px solid #ddd;">LinkedIn</td><td style="padding: 8px; border: 1px solid #ddd;">Thought Leadership</td><td style="padding: 8px; border: 1px solid #ddd;">Draft</td></tr>
                </table>
            `
        },
        {
            id: 'marketing-press-release',
            title: 'Official Press Release',
            type: 'Template',
            category: 'Marketing',
            client: 'Public Relations',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <p style="text-align: right; font-weight: bold; color: #666;">FOR IMMEDIATE RELEASE</p>
                <h1 style="text-align: center;">[Headline: Catchy, Concise, and Compelling]</h1>
                <p style="text-align: center; font-weight: bold;">[Sub-headline: Elaborate on the headline]</p>
                <p><strong>[CITY, State] — [Date]</strong> — {{company_name}} today announced [Major News Item]. This initiative aims to [Impact on Industry/Society].</p>
                <p>"[Executive Quote]," said [Name], [Title] at {{company_name}}.</p>
                <h3>About {{company_name}}</h3>
                <p>{{company_name}} is a leading [Industry] firm based in [Location].</p>
                <p style="font-weight: bold;">Contact:</p>
                <p>[Name] | [Email] | [Phone Number]</p>
            `
        },
        {
            id: 'marketing-seo-audit',
            title: 'SEO & Website Audit',
            type: 'Template',
            category: 'Marketing',
            client: 'Web Team',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>SEO Health Audit</h1>
                <h3>1. Technical Summary</h3>
                <ul>
                    <li>[ ] Mobile responsiveness confirmed</li>
                    <li>[ ] Page load speed < 2.5s</li>
                    <li>[ ] SSL Certificate active</li>
                </ul>
                <h3>2. On-Page Analysis</h3>
                <p>Target Keyword: [Keyword]</p>
                <ul>
                    <li>[ ] Keyword in H1 and Title Tag</li>
                    <li>[ ] Alt text present for all images</li>
                    <li>[ ] Strategic internal linking established</li>
                </ul>
            `
        },
        {
            id: 'marketing-influencer',
            title: 'Influencer Marketing Agreement',
            type: 'Template',
            category: 'Marketing',
            client: 'Influencer Name',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Influencer Partnership Agreement</h1>
                <p>This agreement outlines the partnership between <strong>{{company_name}}</strong> and <strong>{{client_name}}</strong> ("Influencer").</p>
                <h3>Deliverables</h3>
                <ul>
                    <li>1x Instagram Grid Post</li>
                    <li>3x Instagram Stories with Swipe-up</li>
                    <li>1x Dedicated TikTok video</li>
                </ul>
                <h3>Usage Rights</h3>
                <p>{{company_name}} is granted a [Duration] license to use the content for paid advertising.</p>
                <h3>Compensation</h3>
                <p>Flat fee of $[Amount] upon completion of all deliverables.</p>
            `
        }
    ],
    'Sales': [
        {
            id: 'sales-proposal',
            title: 'Executive Sales Proposal',
            type: 'Template',
            category: 'Sales',
            client: 'Prospect Name',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <div style="padding: 40px; border: 1px solid #eee;">
                    <h1 style="color: #0c2a27;">STRATEGIC PARTNERSHIP PROPOSAL</h1>
                    <p style="font-size: 14px; color: #666;">Prepared for: <strong>{{client_name}}</strong></p>
                    <p style="font-size: 14px; color: #666;">Presented by: <strong>{{company_name}}</strong></p>
                    <hr/>
                    
                    <h3>Executive Summary</h3>
                    <p>Following our discussion on <strong>[Date]</strong>, we have identified key opportunities to optimize your [Department/Process] by leveraging <strong>{{company_name}}</strong>'s proprietary [Solution/Tool].</p>
                    
                    <h3>1. The Challenge</h3>
                    <p>Based on our discovery, <strong>{{client_name}}</strong> is currently facing [Problem 1] and [Problem 2]. These inefficiencies are costing approximately <strong>$[Amount]</strong> per month in lost productivity and overhead.</p>
                    
                    <h3>2. Our Proposed Solution</h3>
                    <p>We propose a phased implementation of [Product/Service]. This solution will provide:</p>
                    <ul>
                        <li><strong>Efficiency:</strong> Reduce [Task] time by [X]%</li>
                        <li><strong>Visibility:</strong> Real-time reporting on [Metric]</li>
                        <li><strong>Scalability:</strong> Infrastructure that grows with your team.</li>
                    </ul>
                    
                    <h3>3. Investment & ROI</h3>
                    <p>The total implementation cost is <strong>$[Amount]</strong>. We project a full return on investment (ROI) within <strong>[Number]</strong> months of launch.</p>
                    
                    <div style="background: #f4fcfb; padding: 20px; border-left: 4px solid #0c2a27; margin: 30px 0;">
                        <p><strong>Proposed Start Date:</strong> [Date]</p>
                        <p><strong>Acceptance Deadline:</strong> [Date]</p>
                    </div>
                </div>
            `,
            header: '{{company_name}} | Confidential Sales Proposal',
            footer: 'Valid for 30 days. Created with Pumpkin Vault.'
        },
        {
            id: 'sales-closing-checklist',
            title: 'Sales: Deal Closing Checklist',
            type: 'Template',
            category: 'Sales',
            client: 'Account Executive',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Deal Closing Checklist</h1>
                <p>Opportunity: [Company Name] | Close Date: [Date]</p>
                <ul>
                    <li>[ ] Final contract signed by both parties</li>
                    <li>[ ] Billing details collected & verified</li>
                    <li>[ ] Onboarding call scheduled</li>
                    <li>[ ] CRM entry updated to "Closed Won"</li>
                    <li>[ ] Implementation team notified</li>
                </ul>
            `
        },
        {
            id: 'sales-cold-outreach',
            title: 'Prospecting: Cold Call Script',
            type: 'Template',
            category: 'Sales',
            client: 'Lead Generation',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>COLD CALL SCRIPT: [CAMPAIGN NAME]</h1>
                <p>Objective: Schedule a 15-minute Discovery Call</p>
                
                <h3>1. The Opener (Permission-Based)</h3>
                <p>"Hi [Lead Name], this is [My Name] from {{company_name}}. I know I'm calling out of the blue, but do you have 30 seconds for me to tell you why I'm calling and then you can decide if we keep talking?"</p>
                
                <h3>2. The Hook (The 'Why Now')</h3>
                <p>"The reason I'm reaching out is that we're working with [Competitor/Similar Company] and we've helped them reduce their [Pain Point] by [X]% using our [Unique Feature]. I saw that you're currently [Action/Trigger], and I thought this might be timely."</p>
                
                <h3>3. Discovery Questions</h3>
                <ul>
                    <li>"How are you currently handling [Process]?"</li>
                    <li>"If you could change one thing about [Problem], what would it be?"</li>
                </ul>
                
                <h3>4. Objection Handling</h3>
                <p><strong>"We're already using [Competitor]:"</strong> -> "That makes sense, they are a solid choice. Many of our customers switched because they needed more [Specific Benefit] which [Competitor] doesn't prioritize. Would it be worth a 5-minute comparison?"</p>
                
                <h3>5. The Close (Calendar Invite)</h3>
                <p>"I'd love to show you the specific results we're seeing. Are you at your computer? I can send over a 15-minute invite for next Tuesday at 10 AM or Wednesday at 2 PM. Which works better?"</p>
            `
        },
        {
            id: 'sales-account-plan',
            title: 'Account Management: Growth Plan',
            type: 'Template',
            category: 'Sales',
            client: 'Existing Customer',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>STRATEGIC ACCOUNT PLAN: [CUSTOMER NAME]</h1>
                <h3>1. Account Health Summary</h3>
                <p>Current Tier: [Gold/Silver] | Monthly Spend: $[Amount] | Health Score: [8/10]</p>
                
                <h3>2. Relationship Mapping</h3>
                <ul>
                    <li><strong>Executive Sponsor:</strong> [Name]</li>
                    <li><strong>Day-to-day Admin:</strong> [Name]</li>
                    <li><strong>Internal Champion:</strong> [Name]</li>
                </ul>
                
                <h3>3. Expansion Opportunities</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Opportunity</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Potential Value</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Upsell Date</th>
                    </tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">Seat Expansion</td><td style="padding: 10px; border: 1px solid #ddd;">$[Amount]</td><td style="padding: 10px; border: 1px solid #ddd;">Q3</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">Module Upgrade</td><td style="padding: 10px; border: 1px solid #ddd;">$[Amount]</td><td style="padding: 10px; border: 1px solid #ddd;">Q4</td></tr>
                </table>
            `
        },
        {
            id: 'sales-demo-guide',
            title: 'Pre-Demo Discovery Questionnaire',
            type: 'Template',
            category: 'Sales',
            client: 'Sales Engineering',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Pre-Demo Discovery Form</h1>
                <p>Client: [Company Name] | Date: {{date}}</p>
                <h3>Primary Objectives</h3>
                <p>[What does the client hope to see today?]</p>
                <h3>Pain Points</h3>
                <p>[List 3 specific problems they need to solve]</p>
                <h3>Stakeholders</h3>
                <ul>
                    <li><strong>Champion:</strong> [Name]</li>
                    <li><strong>Decision Maker:</strong> [Name]</li>
                    <li><strong>Technical Lead:</strong> [Name]</li>
                </ul>
            `
        },
        {
            id: 'sales-forecast',
            title: 'Monthly Sales Forecast Sheet',
            type: 'Template',
            category: 'Sales',
            client: 'Internal / Revenue Ops',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Monthly Sales Forecast: [Month]</h1>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Opportunity</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Stage</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Value</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Probability</th>
                    </tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">[Acme Corp]</td><td style="padding: 8px; border: 1px solid #ddd;">Negotiation</td><td style="padding: 8px; border: 1px solid #ddd;">$[00,000]</td><td style="padding: 8px; border: 1px solid #ddd;">75%</td></tr>
                </table>
                <p style="font-weight: bold; margin-top: 10px;">Weighted Pipeline Value: $[00,000]</p>
            `
        },
        {
            id: 'sales-partnership',
            title: 'Strategic Partnership Agreement',
            type: 'Template',
            category: 'Sales',
            client: 'Partner Organization',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Strategic Partnership Agreement</h1>
                <p>This agreement establishes a mutual referral and co-marketing partnership between <strong>{{company_name}}</strong> and <strong>{{client_name}}</strong>.</p>
                <h3>Joint Objectives</h3>
                <p>[Describe the goals of the partnership]</p>
                <h3>Referral Commission</h3>
                <p>A [Percentage]% fee will be paid for all successfully closed leads referred by either party.</p>
                <h3>Term</h3>
                <p>This agreement is effective for 12 months, renewing automatically.</p>
            `
        }
    ],
    'Legal': [
        {
            id: 'legal-nda',
            title: 'Mutual Non-Disclosure Agreement',
            type: 'Template',
            category: 'Legal',
            client: 'Counterparty',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>MUTUAL NON-DISCLOSURE AGREEMENT (NDA)</h1>
                <p>This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of <strong>{{date}}</strong> (the "Effective Date") by and between <strong>{{company_name}}</strong> and <strong>{{client_name}}</strong> (each a "Party").</p>
                
                <h3>1. Purpose</h3>
                <p>The Parties wish to explore a potential business relationship (the "Purpose") and in connection with such Purpose, one Party (the "Disclosing Party") may disclose to the other Party (the "Receiving Party") certain confidential and proprietary information.</p>
                
                <h3>2. Definition of Confidential Information</h3>
                <p>"Confidential Information" means any non-public information, including but not limited to business plans, financial data, customer lists, software code, inventions, and trade secrets, whether disclosed orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential.</p>
                
                <h3>3. Obligations of Receiving Party</h3>
                <p>The Receiving Party shall: (a) hold the Confidential Information in strict confidence; (b) use the Confidential Information only for the Purpose; and (c) not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party.</p>
                
                <h3>4. Term and Termination</h3>
                <p>This Agreement shall remain in effect for a period of <strong>[Number, e.g., 2]</strong> years from the Effective Date. The obligations of confidentiality shall survive termination for an additional period of <strong>[Number, e.g., 3]</strong> years.</p>
                
                <div style="margin-top: 40px; display: grid; grid-template-cols: 1fr 1fr; gap: 40px;">
                    <div>
                        <p><strong>{{company_name}}</strong></p>
                        <p>By: ______________________</p>
                    </div>
                    <div>
                        <p><strong>{{client_name}}</strong></p>
                        <p>By: ______________________</p>
                    </div>
                </div>
            `,
            footer: 'Standard Mutual NDA - v.2024.1'
        },
        {
            id: 'legal-regulatory-calendar',
            title: 'Legal: Regulatory Filing Calendar',
            type: 'Template',
            category: 'Legal',
            client: 'Internal / Compliance',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>REGULATORY FILING & COMPLIANCE CALENDAR</h1>
                <p>Maintaining institutional compliance with state and federal regulations.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Filing Name</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Agency</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Due Date</th>
                    </tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">Annual Report</td><td style="padding: 10px; border: 1px solid #ddd;">Secretary of State</td><td style="padding: 10px; border: 1px solid #ddd;">[Date]</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">Form 5500</td><td style="padding: 10px; border: 1px solid #ddd;">Dept of Labor</td><td style="padding: 10px; border: 1px solid #ddd;">[Date]</td></tr>
                </table>
            `
        },
        {
            id: 'legal-whistleblower',
            title: 'Policy: Whistleblower Protection',
            type: 'Template',
            category: 'Legal',
            client: 'Internal / HR',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Whistleblower Protection Policy</h1>
                <h3>1. Purpose</h3>
                <p>{{company_name}} is committed to high standards of ethical, moral, and legal business conduct.</p>
                <h3>2. Reporting Procedure</h3>
                <p>Employees may report suspected violations of law or policy anonymously through [Reporting Mechanism/Link].</p>
                <h3>3. No Retaliation</h3>
                <p>No employee who in good faith reports a violation shall suffer harassment, retaliation, or adverse employment consequence.</p>
            `
        },
        {
            id: 'legal-consultancy-agreement',
            title: 'Independent Consultancy Agreement',
            type: 'Template',
            category: 'Legal',
            client: 'Contractor',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Consultancy Services Agreement</h1>
                <p>This Agreement is between <strong>{{company_name}}</strong> ("Client") and <strong>{{client_name}}</strong> ("Consultant").</p>
                <h3>1. Services</h3>
                <p>Consultant shall perform the following services: [Detailed Scope of Work].</p>
                <h3>2. Compensation</h3>
                <p>Client shall pay Consultant $[Rate] per [Hour/Project], payable within [Number] days of invoice.</p>
                <h3>3. Intellectual Property</h3>
                <p>All work product created by the Consultant under this Agreement shall be the sole property of the Client.</p>
            `
        },
        {
            id: 'legal-invention-disclosure',
            title: 'IP: Invention Disclosure Form',
            type: 'Template',
            category: 'Legal',
            client: 'Internal / R&D',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Invention Disclosure Statement</h1>
                <p>Inventor: [Name] | Date of Invention: [Date]</p>
                <h3>1. Title of Invention</h3>
                <p>[Provide a brief, descriptive title]</p>
                <h3>2. Description</h3>
                <p>[Describe the problem solved and the unique solution developed. Attach diagrams if necessary.]</p>
                <h3>3. Public Disclosure</h3>
                <p>Has this invention been disclosed to anyone outside the company? [Yes/No]. If yes, provide details and dates.</p>
            `
        },
        {
            id: 'legal-shareholder-resolution',
            title: 'Corporate: Shareholder Resolution',
            type: 'Template',
            category: 'Legal',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Action by Written Consent of Shareholders</h1>
                <p>PURSUANT TO THE BYLAWS of <strong>{{company_name}}</strong>, the following resolution is hereby adopted:</p>
                <p style="margin: 20px 0;"><strong>RESOLVED:</strong> That [Describe Action, e.g., the appointment of a new Director] is hereby APPROVED by the majority of shareholders.</p>
                <hr/>
                <p>Executed by: ______________________ (Majority Shareholder)</p>
            `
        },
        {
            id: 'legal-cease-desist',
            title: 'Legal: Cease and Desist (Draft)',
            type: 'Template',
            category: 'Legal',
            client: 'Counterparty',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Notice to Cease and Desist</h1>
                <p>To: [Infringing Party Name] | [Address]</p>
                <p>It has come to our attention that you are currently engaged in [Describe Infringement, e.g., unauthorized use of our trademark/copyrighted material].</p>
                <p>THIS LETTER CONSTITUTES FORMAL NOTICE to immediately cease and desist all such infringing activities. Failure to do so within [Number] days will result in further legal action.</p>
            `
        },
        {
            id: 'legal-incorporation',
            title: 'Articles of Incorporation',
            type: 'Template',
            category: 'Legal',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Articles of Incorporation</h1>
                <p>The undersigned, for the purpose of forming a corporation under the laws of the State of [State], hereby certifies:</p>
                <h3>Article I: Name</h3>
                <p>The name of the corporation is <strong>{{company_name}}</strong>.</p>
                <h3>Article II: Purpose</h3>
                <p>The purpose for which the corporation is organized is to engage in any lawful act or activity for which corporations may be organized.</p>
                <h3>Article III: Shares</h3>
                <p>The total number of shares which the corporation is authorized to issue is [Number] shares of Common Stock.</p>
            `
        },
        {
            id: 'legal-board-minutes',
            title: 'Board Meeting Minutes',
            type: 'Template',
            category: 'Legal',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Minutes of the Meeting of the Board of Directors</h1>
                <p><strong>Date:</strong> {{date}}<br/><strong>Location:</strong> [Virtual/Address]</p>
                <h3>Resolutions</h3>
                <p>The Board unanimously APPROVED the minutes of the previous meeting.</p>
            `
        }
    ],
    'Tax & Gov': [
        {
            id: 'tax-w9-pro',
            title: 'IRS Form W-9 (Official)',
            type: 'Template',
            category: 'Tax & Gov',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Form W-9: Request for Taxpayer ID</h1>
                <div style="border: 2px solid black; padding: 15px;">
                    <p><strong>1. Name:</strong> {{company_name}}</p>
                    <p><strong>2. Business Name:</strong> [DBA Name]</p>
                    <p><strong>3. Federal Tax Classification:</strong> [Select One]</p>
                    <p><strong>4. Address:</strong> {{company_address}}</p>
                    <hr/>
                    <p><strong>Part I: Taxpayer Identification Number (TIN)</strong></p>
                    <p>EIN: [__-_______]</p>
                </div>
            `,
            header: 'DEPARTMENT OF THE TREASURY<br/>Internal Revenue Service',
            footer: 'IRS Form W-9 (Rev. October 2024)'
        },
        {
            id: 'tax-estimated-worksheet',
            title: 'Quarterly Estimated Tax Worksheet',
            type: 'Template',
            category: 'Tax & Gov',
            client: 'Tax Planning',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>QUARTERLY ESTIMATED TAX WORKSHEET</h1>
                <p>For the tax year ending December 31, [Year].</p>
                
                <h3>1. Adjusted Gross Income (AGI) Projection</h3>
                <p>Projected total income for the year: <strong>$[Amount]</strong></p>
                <p>Subtract standard/itemized deductions: <strong>$[Amount]</strong></p>
                <p>Estimated Taxable Income: <strong>$[Amount]</strong></p>
                
                <h3>2. Self-Employment Tax Calculation</h3>
                <p>Net profit from self-employment: <strong>$[Amount]</strong></p>
                <p>Multiply by 92.35% (0.9235): <strong>$[Amount]</strong></p>
                <p>Self-employment tax (15.3%): <strong>$[Amount]</strong></p>
                
                <h3>3. Credits and Withholding</h3>
                <p>Estimated tax credits (e.g., Child Tax Credit): <strong>$[Amount]</strong></p>
                <p>Estimated federal income tax withheld: <strong>$[Amount]</strong></p>
                
                <h3>4. Quarterly Payment Amount</h3>
                <div style="background: #e9f5ff; padding: 20px; border: 1px solid #007bff; margin: 20px 0;">
                    <p>Total Estimated Tax: $[Amount]</p>
                    <p>Divide by 4: <strong>$[Quarterly Payment]</strong></p>
                </div>
            `
        },
        {
            id: 'tax-audit-checklist',
            title: 'Tax: Audit Preparation Checklist',
            type: 'Template',
            category: 'Tax & Gov',
            client: 'Finance / CPA',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>TAX AUDIT PREPARATION CHECKLIST</h1>
                <p>Ensure all documentation is ready for internal or external review.</p>
                
                <h3>1. Gross Receipts & Income</h3>
                <ul>
                    <li>[ ] Bank statements for all business accounts</li>
                    <li>[ ] 1099-NEC and 1099-K forms received</li>
                    <li>[ ] Sales journals and point-of-sale summaries</li>
                </ul>
                
                <h3>2. Expenses & Deductions</h3>
                <ul>
                    <li>[ ] Receipts for all purchases > $75</li>
                    <li>[ ] Canceled checks or credit card statements</li>
                    <li>[ ] Mileage logs for business vehicle use</li>
                </ul>
            `
        },
        {
            id: 'gov-osha-log',
            title: 'Compliance: OSHA 300A Summary',
            type: 'Template',
            category: 'Tax & Gov',
            client: 'Safety / Compliance',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>OSHA Summary of Work-Related Injuries</h1>
                <p>Year: [Year] | Establishment: {{company_name}}</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Category</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Total Cases</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Total Days Away</th>
                    </tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">Injuries</td><td style="padding: 8px; border: 1px solid #ddd;">0</td><td style="padding: 8px; border: 1px solid #ddd;">0</td></tr>
                </table>
                <p>Post this summary from February 1 to April 30 in a visible area.</p>
            `
        },
        {
            id: 'gov-grant-proposal',
            title: 'Gov Liaison: Grant Proposal Framework',
            type: 'Template',
            category: 'Tax & Gov',
            client: 'Public / Non-profit',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Grant Funding Proposal</h1>
                <h3>1. Executive Summary</h3>
                <p>[How will this grant help {{company_name}} achieve its mission?]</p>
                <h3>2. Project Need</h3>
                <p>[Identify the community/industrial problem your project addresses]</p>
                <h3>3. Budget & Resource Allocation</h3>
                <p>Total Funds Requested: $[Amount]</p>
                <ul>
                    <li>Personnel: $[Amount]</li>
                    <li>Equipment: $[Amount]</li>
                    <li>Operations: $[Amount]</li>
                </ul>
            `
        },
        {
            id: 'tax-1099-nec',
            title: 'Form 1099-NEC Nonemployee Compensation',
            type: 'Template',
            category: 'Tax & Gov',
            client: 'Contractor',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Form 1099-NEC: Nonemployee Compensation</h1>
                <div style="border: 1px solid #000; padding: 10px;">
                    <p><strong>PAYER'S Name:</strong> {{company_name}}</p>
                    <p><strong>RECIPIENT'S Name:</strong> {{client_name}}</p>
                    <hr/>
                    <p><strong>1. Nonemployee Compensation:</strong> $[Amount]</p>
                    <p><strong>4. Federal income tax withheld:</strong> $0.00</p>
                </div>
            `,
            header: 'INTERNAL REVENUE SERVICE<br/>Official Tax Document'
        },
        {
            id: 'gov-license-app',
            title: 'Business License Application',
            type: 'Template',
            category: 'Tax & Gov',
            client: 'City/County',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Application for Business License</h1>
                <h3>Applicant Information</h3>
                <p>Legal Name: <strong>{{company_name}}</strong><br/>Tax ID: [EIN]</p>
                <p>I certify that all statements made in this application are true and complete.</p>
            `
        }
    ],
    'Misc': [
        {
            id: 'gen-it-incident',
            title: 'IT Support: Incident Report',
            type: 'Template',
            category: 'General',
            client: 'IT / Tech Support',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>SYSTEM INCIDENT REPORT (SIR)</h1>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background: #fef2f2; width: 30%;"><strong>Severity:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px; color: #b91c1c; font-weight: bold;">[P1 - Critical / P2 - High]</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;"><strong>Incident ID:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px;">#INC-[00123]</td>
                    </tr>
                </table>

                <h3>1. Incident Summary</h3>
                <p><strong>Time of First Alert:</strong> [HH:MM UTC]<br/><strong>Systems Affected:</strong> [e.g., API Gateway, Stripe Integration]</p>
                <p>[Provide a high-level summary of what happened and the immediate business impact.]</p>
                
                <h3>2. Timeline of Events</h3>
                <ul>
                    <li><strong>[HH:MM]:</strong> Anomaly detected in [System]</li>
                    <li><strong>[HH:MM]:</strong> Engineering team notified; war room established</li>
                    <li><strong>[HH:MM]:</strong> Root cause identified as [Description]</li>
                    <li><strong>[HH:MM]:</strong> Hotfix deployed; services returned to normal</li>
                </ul>
                
                <h3>3. Root Cause Analysis (RCA)</h3>
                <p>[Detailed explanation of why the failure occurred. Was it a code regression? Infrastructure failure? Third-party API outage?]</p>
                
                <h3>4. Preventative Actions</h3>
                <p>[What steps will we take to ensure this specific failure doesn't happen again?]</p>
            `
        },
        {
            id: 'gen-internal-comms',
            title: 'Admin: Internal Comms Policy',
            type: 'Template',
            category: 'General',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>INTERNAL COMMUNICATIONS POLICY</h1>
                <p>Guidelines for clear, inclusive, and effective communication at <strong>{{company_name}}</strong>.</p>
                
                <h3>1. Channel Usage</h3>
                <p><strong>Slack:</strong> For urgent, synchronous collaboration and social bonding.</p>
                <p><strong>Email:</strong> For formal announcements, external communication, and documentation.</p>
                <p><strong>Notion/Wiki:</strong> For persistent knowledge and SOPs.</p>
                
                <h3>2. The "3-Reply" Rule</h3>
                <p>If a Slack thread exceeds 3 replies without reaching a resolution, participants should move to a huddle or a formal meeting.</p>
            `
        },
        {
            id: 'gen-security-audit',
            title: 'Security: Access & Policy Audit',
            type: 'Template',
            category: 'General',
            client: 'Internal / Security',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Internal Security Audit</h1>
                <h3>1. Account Security</h3>
                <ul>
                    <li>[ ] 2FA enabled for all critical accounts</li>
                    <li>[ ] Regular password rotations confirmed</li>
                    <li>[ ] Inactive accounts deactivated</li>
                </ul>
                <h3>2. Physical Security</h3>
                <ul>
                    <li>[ ] Server room locked and logged</li>
                    <li>[ ] Visitor logs are up to date</li>
                </ul>
            `
        },
        {
            id: 'gen-expense-reimbursement',
            title: 'Admin: Expense Reimbursement',
            type: 'Template',
            category: 'General',
            client: 'Operations / Finance',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Expense Reimbursement Form</h1>
                <p>Employee: [Name] | Date: {{date}}</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Category</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Description</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Amount</th>
                    </tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;">[Date]</td><td style="padding: 8px; border: 1px solid #ddd;">Travel</td><td style="padding: 8px; border: 1px solid #ddd;">[Travel Details]</td><td style="padding: 8px; border: 1px solid #ddd;">$[0.00]</td></tr>
                </table>
                <p style="font-weight: bold; margin-top: 10px;">Total Reimbursement: $[0.00]</p>
            `
        },
        {
            id: 'gen-rd-log',
            title: 'Innovation: R&D Lab Log',
            type: 'Template',
            category: 'General',
            client: 'Product / R&D',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Research & Innovation Log</h1>
                <p>Lead Researcher: [Name] | Project: [Name]</p>
                <h3>1. Hypothesis / Goal</h3>
                <p>[What is the goal of today's research?]</p>
                <h3>2. Experimental Results</h3>
                <p>[Documentation of outcomes and observations]</p>
                <h3>3. Key Learnings</h3>
                <p>[What did we discover? What are the next steps?]</p>
            `
        },
        {
            id: 'gen-meeting-agenda',
            title: 'Professional Meeting Agenda',
            type: 'Template',
            category: 'General',
            client: 'Internal',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Meeting Agenda: [Meeting Title]</h1>
                <p><strong>Date:</strong> {{date}}<br/><strong>Time:</strong> [Time]<br/><strong>Facilitator:</strong> [Name]</p>
                <h3>Objective</h3>
                <p>[What do we want to achieve?]</p>
                <h3>Schedule</h3>
                <ul>
                    <li><strong>0-10m:</strong> Introduction & Goals</li>
                    <li><strong>10-40m:</strong> Main Discussion Topic</li>
                    <li><strong>40-50m:</strong> Action Items & Next Steps</li>
                    <li><strong>50-60m:</strong> Closing</li>
                </ul>
            `
        },
        {
            id: 'gen-analytics-brief',
            title: 'Data & Analytics Project Brief',
            type: 'Template',
            category: 'General',
            client: 'Data Team',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>Analytics Project Brief</h1>
                <h3>1. Business Question</h3>
                <p>[What specific question are we trying to answer with data?]</p>
                <h3>2. Data Sources</h3>
                <p>[List databases, APIs, or files required: e.g., Stripe, Shopify, Google Analytics]</p>
                <h3>3. Key Metrics (KPIs)</h3>
                <ul>
                    <li>Primary: [e.g., Conversion Rate]</li>
                    <li>Secondary: [e.g., Average Order Value]</li>
                </ul>
                <h3>4. Expected Output</h3>
                <p>[e.g., Tableau Dashboard, SQL Query, PDF Report]</p>
            `
        },
        {
            id: 'gen-project-plan',
            title: 'High-Level Project Plan',
            type: 'Template',
            category: 'Misc',
            client: 'Project Alpha',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: `
                <h1>STRATEGIC PROJECT CHARTER & PLAN</h1>
                <p>Project Name: <strong>[Name]</strong> | Sponsor: <strong>[Name]</strong></p>
                
                <h3>1. Problem Statement</h3>
                <p>[What is the specific pain point this project addresses? Why now?]</p>
                
                <h3>2. Project Scope (In-Scope / Out-of-Scope)</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Feature/Task</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
                    </tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">[Primary Feature]</td><td style="padding: 10px; border: 1px solid #ddd;">In-Scope</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">[Secondary Integration]</td><td style="padding: 10px; border: 1px solid #ddd;">Out-of-Scope</td></tr>
                </table>
                
                <h3>3. Key Milestones & Roadmap</h3>
                <ul>
                    <li><strong>Phase 1: Research (M1):</strong> Needs assessment and vendor selection.</li>
                    <li><strong>Phase 2: Build (M2-M4):</strong> Core development and internal testing.</li>
                    <li><strong>Phase 3: Launch (M5):</strong> Global rollout and training.</li>
                </ul>
                
                <h3>4. Resource Allocation</h3>
                <p><strong>Staffing:</strong> [Name 1], [Name 2]<br/><strong>External:</strong> [Agency Name]</p>
            `
        }
    ]
};

export const ALL_TEMPLATES: PumpkinDocument[] = Object.values(CATEGORIZED_TEMPLATES).flat();

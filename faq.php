<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ — SQL Town</title>
    <link rel="icon" href="/favicon.png" type="image/png">
    <link rel="shortcut icon" href="/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="/favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&family=Tiro+Telugu:ital@0;1&display=swap" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="index.css">
    <style>
        .faq-hero {
            min-height: 40vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem 2rem;
            position: relative;
        }

       

        .faq-title {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 800;
            color: var(--text-black);
            text-align: center;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
            margin-top: 3rem;
        }

        .faq-subtitle {
            font-size: clamp(1rem, 2vw, 1.3rem);
            color: var(--text-gray);
            text-align: center;
            margin-bottom: 3rem;
            font-weight: 400;
        }

        .faq-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }

        .faq-tabs {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }

        .faq-tab {
            font-family: 'Syne', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-black);
            background: white;
            border: 2px solid var(--text-black);
            padding: 0.75rem 2rem;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
        }

        .faq-tab:hover {
            background: var(--warm-gray);
        }

        .faq-tab.active {
            background: var(--text-black);
            color: white;
            border-color: var(--text-black);
        }

        .faq-category {
            display: none;
            margin-bottom: 3rem;
            padding: 0 2rem;
        }

        .faq-category.active {
            display: block;
        }

        .faq-category-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-black);
            margin-bottom: 2rem;
            display: none;
        }

        .faq-category-icon {
            font-size: 2rem;
        }

        .faq-item {
            background: transparent;
            border-radius: 0;
            margin-bottom: 0;
            overflow: visible;
            transition: all 0.3s ease;
            border: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .faq-item:last-child {
            border-bottom: none;
        }

        .faq-item:hover {
            box-shadow: none;
            border-color: rgba(0, 0, 0, 0.15);
        }

        .faq-question-wrapper {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem 0;
            cursor: pointer;
        }

        .faq-icon {
            display: none;
        }

        .faq-item:hover .faq-icon {
            background: transparent;
            color: inherit;
        }

        .faq-question {
            font-family: 'Syne', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-black);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            user-select: none;
            flex: 1;
            padding: 0;
        }

        .faq-question:hover {
            color: var(--cyan);
        }

        .faq-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            color: var(--text-gray);
            transition: transform 0.3s ease, color 0.3s ease;
            flex-shrink: 0;
            margin-left: 1rem;
        }

        .faq-toggle svg {
            width: 100%;
            height: 100%;
            stroke: currentColor;
            stroke-width: 2.5;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .faq-item.active .faq-toggle {
            transform: rotate(180deg);
            color: var(--cyan);
        }

        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, padding 0.4s ease;
        }

        .faq-item.active .faq-answer {
            max-height: 1000px;
        }

        .faq-answer-content {
            padding: 0 0 1.5rem 0;
            margin-left: 0;
            font-family: 'Syne', sans-serif;
            font-size: 1rem;
            line-height: 1.7;
            color: var(--text-gray);
        }

        .faq-answer-content code {
            font-family: 'JetBrains Mono', monospace;
            background: var(--warm-gray);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
            color: var(--cyan);
        }

        .faq-answer-content strong {
            color: var(--text-black);
            font-weight: 600;
        }

        .faq-answer-content ul {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }

        .faq-answer-content li {
            margin: 0.5rem 0;
        }

        .faq-cta {
            background: linear-gradient(135deg, var(--cyan) 0%, #5a8bc4 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
            margin-top: 4rem;
            border-radius: 16px;
        }

        .faq-cta h3 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .faq-cta p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.95;
        }

        .faq-cta-button {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            background: white;
            color: var(--cyan);
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
            font-weight: 700;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-family: 'Syne', sans-serif;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .faq-cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .faq-footer {
            text-align: center;
            padding: 3rem 2rem;
            background: var(--warm-gray);
            margin-top: 4rem;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .faq-footer p {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            color: var(--text-gray);
        }

        @media (max-width: 768px) {
            .faq-nav {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem;
            }

            .faq-container {
                padding: 1rem;
            }

            .faq-tabs {
                gap: 0.5rem;
            }

            .faq-tab {
                font-size: 0.9rem;
                padding: 0.6rem 1.5rem;
            }

            .faq-question-wrapper {
                padding: 1rem 0;
            }

            .faq-question {
                font-size: 1rem;
            }

            .faq-answer-content {
                padding: 0 0 1rem 0;
                margin-left: 0;
                font-size: 0.9rem;
            }

            .faq-icon {
                width: 35px;
                height: 35px;
                min-width: 35px;
                font-size: 1.1rem;
            }
        }
    </style>
</head>
<body>

    <!-- Hero Section -->
    <section class="faq-hero">
        <h1 class="faq-title">Frequently Asked Questions</h1>
        <p class="faq-subtitle">Everything you need to know about building your SQL city</p>
    </section>

    <!-- FAQ Container -->
    <div class="faq-container">
        <!-- Tab Navigation -->
        <div class="faq-tabs">
            <button class="faq-tab active" data-category="getting-started">Getting Started</button>
            <button class="faq-tab" data-category="learning">Learning</button>
            <button class="faq-tab" data-category="technical">Technical</button>
            <button class="faq-tab" data-category="pricing">Pricing</button>
            <button class="faq-tab" data-category="support">Support</button>
        </div>

        <!-- Getting Started -->
        <div class="faq-category active" data-category="getting-started">
            <h2 class="faq-category-title">
                <span class="faq-category-icon">🚀</span>
                Getting Started
            </h2>

            <div class="faq-item active">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">😊</div>
                    <div class="faq-question">
                        What is SQL Town?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        SQL Town is an interactive learning platform that teaches SQL through building a virtual city. Instead of boring tutorials, you'll create databases, tables, and relationships by constructing buildings, temples, and infrastructure in your sacred city of Vrindavan. Each SQL query you write brings your city to life!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🎓</div>
                    <div class="faq-question">
                        Do I need prior programming experience?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <strong>Not at all!</strong> SQL Town is designed for complete beginners. We start with the basics like <code>SELECT</code> and <code>FROM</code>, and gradually build up to advanced concepts. The visual feedback and game-like progression make it easy to learn at your own pace.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">⏰</div>
                    <div class="faq-question">
                        How long does it take to complete?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        The journey from SQL newbie to database architect typically takes <strong>40-60 hours</strong> spread across 50+ levels. However, you can learn at your own pace! Some people finish in a few weeks, while others take several months. Your city saves progress automatically, so you can pick up where you left off anytime.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🖥️</div>
                    <div class="faq-question">
                        What devices can I use SQL Town on?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        SQL Town works on <strong>any device</strong> with a modern web browser - desktop, laptop, tablet, or even mobile! However, we recommend using a desktop or laptop for the best experience, as it's easier to write and test SQL queries on a larger screen with a physical keyboard.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🚪</div>
                    <div class="faq-question">
                        How do I create an account?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Simply click <strong>"Start Building"</strong> on the homepage and you can begin immediately! You can play as a guest or sign up with your email or Google account to save your progress across devices. Creating an account is optional for the first 5 levels, but required to continue beyond that.
                    </div>
                </div>
            </div>
        </div>

        <!-- Learning & Progress -->
        <div class="faq-category" data-category="learning">
            <h2 class="faq-category-title">
                <span class="faq-category-icon">📚</span>
                Learning & Progress
            </h2>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">📈</div>
                    <div class="faq-question">
                        How does the leveling system work?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Progress through 7 major milestones:
                        <ul>
                            <li><strong>Hello World (LVL 1-5):</strong> Basic SELECT queries</li>
                            <li><strong>First Village (LVL 6-12):</strong> CREATE, INSERT, UPDATE</li>
                            <li><strong>Growing Town (LVL 13-20):</strong> JOINs and relationships</li>
                            <li><strong>City Builder (LVL 21-30):</strong> Subqueries and indexes</li>
                            <li><strong>Architect (LVL 31-40):</strong> Advanced patterns</li>
                            <li><strong>Database Master (LVL 41-50):</strong> Transactions & concurrency</li>
                            <li><strong>SQL Legend (LVL 51+):</strong> Enterprise architecture</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">❌</div>
                    <div class="faq-question">
                        What happens if I make a mistake?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Mistakes are part of learning! When you write incorrect SQL, your city provides visual feedback - buildings might not appear, or you'll see helpful error messages. You can retry as many times as needed. There's no penalty for experimenting!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🌐</div>
                    <div class="faq-question">
                        Can I share my city with others?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <strong>Yes!</strong> Your skyline is your portfolio. Once you complete milestones, you can share screenshots or links to your city. It's a great way to showcase your SQL skills to potential employers or fellow learners.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🎯</div>
                    <div class="faq-question">
                        Are there deadlines or time limits?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <strong>No deadlines at all!</strong> SQL Town is designed for self-paced learning. Take as much time as you need on each level. You can start and stop whenever you want, and your progress is automatically saved. Whether you learn for 10 minutes or 2 hours a day, you're making progress!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🏆</div>
                    <div class="faq-question">
                        Do I get a certificate when I complete the course?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Yes! Premium members receive a <strong>Certificate of Completion</strong> when they finish all 50 levels. The certificate includes your city screenshot, completion date, and verified skills. You can add it to your LinkedIn profile or include it in job applications.
                    </div>
                </div>
            </div>
        </div>

        <!-- Technical -->
        <div class="faq-category" data-category="technical">
            <h2 class="faq-category-title">
                <span class="faq-category-icon">⚙️</span>
                Technical
            </h2>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">💾</div>
                    <div class="faq-question">
                        Which database system does SQL Town use?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        SQL Town uses <strong>PostgreSQL</strong> as the default database engine, but the concepts you learn apply to all major SQL databases (MySQL, SQL Server, Oracle, SQLite). We focus on standard SQL syntax that works everywhere.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">📥</div>
                    <div class="faq-question">
                        Do I need to install anything?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <strong>No installation required!</strong> SQL Town runs entirely in your browser. All you need is an internet connection and a modern web browser (Chrome, Firefox, Safari, or Edge). Your progress is saved in the cloud automatically.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🔄</div>
                    <div class="faq-question">
                        Can I use SQL Town offline?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Currently, SQL Town requires an internet connection to function. We're working on an <strong>offline mode</strong> for future releases that will allow you to download lessons and work without connectivity. Stay tuned for updates!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">💻</div>
                    <div class="faq-question">
                        Can I export my SQL queries?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <strong>Absolutely!</strong> You can export all your SQL queries as <code>.sql</code> files at any time. This is great for keeping a personal reference library or sharing your solutions with others. Premium users also get access to detailed query performance analytics.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🔒</div>
                    <div class="faq-question">
                        Is my data safe and private?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Yes! We take security seriously. All data is encrypted in transit and at rest. We <strong>never share your personal information</strong> with third parties. Your SQL queries and progress are stored securely and are only accessible to you. We're fully GDPR compliant.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🌍</div>
                    <div class="faq-question">
                        Is SQL Town available in other languages?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Currently, SQL Town is available in <strong>English only</strong>. However, SQL syntax is universal! We're planning to add Spanish, French, German, and Hindi translations in 2026. You can help by joining our translation community on Discord.
                    </div>
                </div>
            </div>

            
        </div>

        <!-- Pricing & Access -->
        <div class="faq-category" data-category="pricing">
            <h2 class="faq-category-title">
                <span class="faq-category-icon">💰</span>
                Pricing & Access
            </h2>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">💵</div>
                    <div class="faq-question">
                        Is SQL Town free?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        The first 20 levels are <strong>completely free</strong>! This covers all the basics and gets you to the "Growing Town" milestone. After that, you can upgrade to access advanced levels, exclusive challenges, and certification options.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">💳</div>
                    <div class="faq-question">
                        How much does premium cost?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Premium access is <strong>$29/month</strong> or <strong>$199/year</strong> (save 43%!). This includes all 50+ levels, certification, priority support, and lifetime access to all future content. We also offer student discounts - just email us with your .edu address.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">↩️</div>
                    <div class="faq-question">
                        Can I get a refund?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Yes! We offer a <strong>30-day money-back guarantee</strong>. If you're not satisfied with SQL Town for any reason, just email us within 30 days of purchase and we'll refund you fully. No questions asked.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🎓</div>
                    <div class="faq-question">
                        Do you offer student or educational discounts?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Absolutely! Students get <strong>50% off</strong> premium with a valid .edu email address. Teachers and educational institutions can contact us for bulk licensing and classroom packages. We believe in making SQL education accessible to everyone!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🔄</div>
                    <div class="faq-question">
                        Can I cancel my subscription anytime?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Yes! You can cancel your subscription at any time from your account settings. There are <strong>no cancellation fees</strong>, and you'll continue to have access until the end of your current billing period. You can always resubscribe later and pick up where you left off.
                    </div>
                </div>
            </div>

            
        </div>

        <!-- Support -->
        <div class="faq-category" data-category="support">
            <h2 class="faq-category-title">
                <span class="faq-category-icon">💬</span>
                Support
            </h2>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">💡</div>
                    <div class="faq-question">
                        I'm stuck on a level. Where can I get help?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Multiple ways to get help:
                        <ul>
                            <li>Click the <strong>💡 Hint</strong> button in any level for guidance</li>
                            <li>Join our community Discord for peer support</li>
                            <li>Check the Documentation section for detailed SQL references</li>
                            <li>Email support@sqltown.dev for direct assistance</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🐛</div>
                    <div class="faq-question">
                        How do I report a bug?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Found a bug? Please email <strong>bugs@sqltown.dev</strong> with:
                        <ul>
                            <li>A description of what went wrong</li>
                            <li>The level or section where it occurred</li>
                            <li>Screenshots if possible</li>
                            <li>Your browser and operating system</li>
                        </ul>
                        We usually respond within 24 hours!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">⏱️</div>
                    <div class="faq-question">
                        What are your support hours?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Our support team is available <strong>Monday-Friday, 9 AM - 6 PM EST</strong>. Premium members get priority support with faster response times. We also have an active Discord community where you can get help from other learners 24/7!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">📧</div>
                    <div class="faq-question">
                        How do I contact support?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        You can reach us at <strong>support@sqltown.dev</strong> for general inquiries, <strong>bugs@sqltown.dev</strong> for technical issues, or use the live chat widget in the bottom right corner of any page. We aim to respond within 24 hours for all inquiries.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">🗺️</div>
                    <div class="faq-question">
                        Where can I find tutorials and documentation?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Click the <strong>"Docs"</strong> button in the main navigation to access our complete SQL reference guide, video tutorials, and example queries. Each level also has built-in hints and explanations. You can also check out our YouTube channel for walkthrough videos!
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question-wrapper">
                    <div class="faq-icon">👥</div>
                    <div class="faq-question">
                        Is there a community I can join?
                        <span class="faq-toggle">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Yes! Join our <strong>Discord community</strong> with over 10,000 SQL learners. Share your city screenshots, get help with tricky queries, participate in weekly challenges, and connect with fellow builders. Find the invite link in your account dashboard.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            // Tab switching
            $('.faq-tab').click(function() {
                const category = $(this).data('category');
                
                // Update active tab
                $('.faq-tab').removeClass('active');
                $(this).addClass('active');
                
                // Show corresponding category
                $('.faq-category').removeClass('active');
                $(`.faq-category[data-category="${category}"]`).addClass('active');
                
                // Close all FAQ items when switching tabs
                $('.faq-item').removeClass('active');
            });

            // FAQ Toggle functionality
            $('.faq-question-wrapper').click(function() {
                const faqItem = $(this).parent();
                const wasActive = faqItem.hasClass('active');
                
                // Close all other items
                $('.faq-item').removeClass('active');
                
                // Toggle current item
                if (!wasActive) {
                    faqItem.addClass('active');
                }
            });

            // Smooth scroll for anchor links
            $('a[href^="#"]').on('click', function(event) {
                var target = $(this.getAttribute('href'));
                if (target.length) {
                    event.preventDefault();
                    $('html, body').stop().animate({
                        scrollTop: target.offset().top - 100
                    }, 800);
                }
            });
        });
    </script>
</body>
</html>

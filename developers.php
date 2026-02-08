<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Developers - SQL Town</title>
    <link rel="icon" href="/favicon.png" type="image/png">
    <link rel="shortcut icon" href="/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="/favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --black: #000000;
            --white: #ffffff;
            --accent: #E67350;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Syne', sans-serif;
            overflow-x: hidden;
        }

        /* Headings: classy serif */
        h1, h2, h3, .section-title h1, .developer-name, .tech-stack-title {
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            color: var(--black);
        }

        .developers-section {
            min-height: auto;
            padding: 2rem 2rem;
            position: relative;
        }

        .section-title {
            text-align: center;
            margin-bottom: 2rem;
        }

        .section-title h1 {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--black);
            margin-bottom: 0.5rem;
        }

        .section-title p {
            font-size: 0.95rem;
            color: var(--black);
        }

        .developers-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        /* Developer Card Styles */
        .developer-card {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: center;
            animation: fadeInUp 0.8s ease;
            padding: 1rem 0;
        }

        .developer-card.top {
            animation-delay: 0.2s;
        }

        .developer-card.top .developer-info {
            order: 1;
        }

        .developer-card.top .developer-image-container {
            order: 2;
        }

        .developer-card.bottom {
            animation-delay: 0.6s;
        }

        .developer-card.bottom .developer-info {
            order: 2;
        }

        .developer-card.bottom .developer-image-container {
            order: 1;
        }

        .developer-info {
            text-align: left;
        }

        .greeting {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
        }

        .developer-name {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.8rem;
            line-height: 1.2;
        }

        .developer-name .name-highlight {
            color: var(--accent);
        }

        .developer-card.top .name-highlight {
            color: var(--accent);
        }

        .developer-card.bottom .name-highlight {
            color: var(--accent);
        }

        .developer-description {
            font-size: 0.9rem;
            color: var(--black);
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        .developer-image-container {
            position: relative;
            width: 100%;
            max-width: 280px;
            margin: 0 auto;
        }

        .developer-image-frame {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            aspect-ratio: 4/5;
        }

        .developer-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .badge-container {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            z-index: 10;
        }

        .badge {
            padding: 0.3rem 1rem;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
        }

        .badge.blue {
            background: var(--accent);
        }

        .badge.green {
            background: var(--accent);
        }

        .cta-button {
            display: inline-block;
            background: var(--accent);
            color: var(--white);
            padding: 0.65rem 1.8rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            box-shadow: 0 3px 12px rgba(230, 115, 80, 0.25);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 18px rgba(230, 115, 80, 0.35);
        }



        .rating-cards {
            display: flex;
            gap: 0.75rem;
            margin-top: 1.2rem;
        }

        .rating-card {
            background: white;
            padding: 0.6rem 1rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.7rem;
        }

        .rating-icon {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            font-weight: bold;
            color: white;
        }


        .rating-info {
            text-align: left;
        }

        .rating-stars {
            color: var(--accent);
            font-size: 0.75rem;
            margin-bottom: 0.15rem;
        }

        .rating-score {
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--black);
            margin-right: 0.3rem;
        }

        .rating-label {
            font-size: 0.7rem;
            color: var(--black);
        }

        /* Tech Stack Center Section */
        .tech-stack-center {
            position: relative;
            animation: fadeIn 1s ease;
            animation-delay: 0.4s;
            animation-fill-mode: both;
            padding: 2.5rem 0;
            border-radius: 0;
            overflow: hidden;
            margin: 0 -2rem;
        }

        .tech-stack-center::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
        }

        .tech-stack-center::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
        }

        .tech-stack-title {
            text-align: center;
            font-size: 1.9rem;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            margin-bottom: 1.6rem;
            letter-spacing: -0.02em;
            color: var(--black);
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .tech-stack-subtitle {
            text-align: center;
            font-size: 0.85rem;
            margin-top: -1.5rem;
            margin-bottom: 2rem;
            font-weight: 400;
        }

        /* Carousel Container */
        .carousel-container {
            position: relative;
            width: 100%;
            overflow: hidden;
            padding: 1.5rem 0;
        }

        .carousel-track {
            display: flex;
            gap: 2rem;
            animation: scroll 35s linear infinite;
            width: fit-content;
        }

        .carousel-track:hover {
            animation-play-state: paused;
        }

        @keyframes scroll {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }

        /* Tech Item Card */
        .tech-item {
            flex-shrink: 0;
            width: 110px;
            height: 110px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(24, 24, 24, 0.08);
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.7rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .tech-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .tech-item:hover {
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-10px) scale(1.05);
        }

        .tech-item:hover::before {
            opacity: 1;
        }

        .tech-item:hover .tech-logo {
            filter: none;
            transform: scale(1.1);
        }

        .tech-item:hover .tech-name {
            color: var(--black);
        }

        .tech-item:hover .tech-description {
            color: var(--text-gray);
        }

        .tech-logo {
            width: 36px;
            height: 36px;
            object-fit: contain;
            transition: all 0.3s ease;
        }

        .tech-name {
            font-weight: 600;
            font-size: 0.9rem;
            text-align: center;
            transition: color 0.4s ease;
            font-family: 'Syne', sans-serif;
        }

        .tech-description {
            font-size: 0.7rem;
            color: rgba(30, 25, 25, 0.5);
            text-align: center;
            transition: color 0.4s ease;
            font-family: 'Syne', sans-serif;
        }

        /* Gradient Overlays for smooth edge fade */
        .carousel-container::before,
        .carousel-container::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 150px;
            z-index: 2;
            pointer-events: none;
        }

        .carousel-container::before {
            left: 0;
        }

        .carousel-container::after {
            right: 0;
        }

       

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        @media (max-width: 1200px) {
            .tech-item {
                width: 100px;
                height: 100px;
            }

            .tech-logo {
                width: 32px;
                height: 32px;
            }
        }

        @media (max-width: 968px) {
            .developer-card {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .developer-card.top .developer-info,
            .developer-card.bottom .developer-info {
                order: 1;
            }

            .developer-card.top .developer-image-container,
            .developer-card.bottom .developer-image-container {
                order: 2;
            }

            .developer-info {
                text-align: center;
            }

            .rating-cards {
                justify-content: center;
            }

            .tech-item {
                width: 92px;
                height: 92px;
            }

            .tech-logo {
                width: 30px;
                height: 30px;
            }

            .tech-stack-title {
                font-size: 1.5rem;
            }
        }

        @media (max-width: 768px) {
            .section-title h1 {
                font-size: 1.8rem;
            }

            .developer-name {
                font-size: 1.5rem;
            }

            .rating-cards {
                flex-direction: column;
            }

            .badge-container {
                flex-direction: column;
                gap: 0.3rem;
            }

            .tech-stack-center {
                padding: 2rem 0;
            }

            .tech-stack-title {
                font-size: 1.3rem;
            }

            .tech-item {
                width: 88px;
                height: 88px;
            }

            .tech-logo {
                width: 28px;
                height: 28px;
            }

            .tech-name {
                font-size: 0.8rem;
            }

            .tech-description {
                font-size: 0.65rem;
            }
        }

        @media (max-width: 480px) {
            .tech-item {
                width: 80px;
                height: 80px;
            }

            .tech-logo {
                width: 24px;
                height: 24px;
            }
        }
    </style>
</head>
<body>
    <?php include 'header.php'; ?>

    <section class="developers-section">

        <!-- Section Title -->
        <div class="section-title">
            <h1>Meet Our Developers</h1>
            <p>The brilliant minds behind SQL Town</p>
        </div>

        <!-- Main Container -->
        <div class="developers-container">
            
            <!-- Top Developer -->
            <div class="developer-card top">
                <div class="developer-info">
                    <div class="greeting">Hey! 👋</div>
                    <h2 class="developer-name">I am <span class="name-highlight">Swapanth Vakapalli</span></h2>
                    <p class="developer-description">
  I’m a developer who loves turning complex tech into simple, fun experiences.
SQLTown is my attempt to make learning SQL feel less scary and more like a game.
I build with curiosity, consistency, and a focus on real-world impact.
                    </p>

                    <a href="#" class="cta-button">Contact →</a>

                                        <script>
                                            document.querySelector('.cta-button').addEventListener('click', function(e) {
                                                e.preventDefault();
                                                window.location.href = 'mailto:swapanthvakapalli@gmail.com?subject=Contact from SQL Town&body=Hi Swapanth,';
                                            });
                                        </script>

                    <div class="rating-cards">
                        <div class="rating-card">
                            <img src="rootsquare.png" alt="Rootsquare" class="rating-icon upwork" style="width: 36px; height: 36px;object-fit: cover;">
                            <div class="rating-info">
                                <div class="rating-stars">Rootsquare ai</div>
                                <div>
                                    <span class="rating-score">Ex</span>
                                    <span class="rating-label">SDE Intern</span>
                                </div>
                            </div>
                        </div>
                        <div class="rating-card">
                            <img src="bluconn-logo.svg" alt="Bluconn" class="rating-icon upwork" style="width: 36px; height: 36px;">
                            <div class="rating-info">
                                <div class="rating-stars">Bluconn.ai</div>
                                <div>
                                    <span class="rating-score">SDE - 1</span>
                                    <span class="rating-label"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="developer-image-container">
                    
                    <div class="developer-image-frame">
                        <img src="swapanth.png" 
                             alt="Swapanth Vakapalli" 
                             class="developer-image">
                    </div>
                </div>
            </div>

            <!-- Center Tech Stack -->
            <div class="tech-stack-center">
                <h3 class="tech-stack-title">Our Tech Stack</h3>
                <p class="tech-stack-subtitle">Powered by industry-leading technologies</p>
                
                <div class="carousel-container">
                    <div class="carousel-track">
                        <!-- First Set of Technologies -->
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" class="tech-logo">
                            <div class="tech-name">React</div>
                            <div class="tech-description">Frontend Framework</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" class="tech-logo">
                            <div class="tech-name">Node.js</div>
                            <div class="tech-description">Backend Runtime</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" class="tech-logo">
                            <div class="tech-name">PostgreSQL</div>
                            <div class="tech-description">Database</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" alt="Firebase" class="tech-logo">
                            <div class="tech-name">Firebase</div>
                            <div class="tech-description">Cloud Services</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" class="tech-logo">
                            <div class="tech-name">Next.js</div>
                            <div class="tech-description">Full Stack Framework</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" class="tech-logo">
                            <div class="tech-name">Tailwind CSS</div>
                            <div class="tech-description">Styling Framework</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" class="tech-logo">
                            <div class="tech-name">MongoDB</div>
                            <div class="tech-description">NoSQL Database</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" alt="AWS" class="tech-logo">
                            <div class="tech-name">AWS</div>
                            <div class="tech-description">Cloud Platform</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" class="tech-logo">
                            <div class="tech-name">Docker</div>
                            <div class="tech-description">Containerization</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" class="tech-logo">
                            <div class="tech-name">TypeScript</div>
                            <div class="tech-description">Type-Safe JavaScript</div>
                        </div>
                        
                        <!-- Duplicate Set for Seamless Loop -->
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" class="tech-logo">
                            <div class="tech-name">React</div>
                            <div class="tech-description">Frontend Framework</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" class="tech-logo">
                            <div class="tech-name">Node.js</div>
                            <div class="tech-description">Backend Runtime</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" class="tech-logo">
                            <div class="tech-name">PostgreSQL</div>
                            <div class="tech-description">Database</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" alt="Firebase" class="tech-logo">
                            <div class="tech-name">Firebase</div>
                            <div class="tech-description">Cloud Services</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" class="tech-logo">
                            <div class="tech-name">Next.js</div>
                            <div class="tech-description">Full Stack Framework</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" class="tech-logo">
                            <div class="tech-name">Tailwind CSS</div>
                            <div class="tech-description">Styling Framework</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" class="tech-logo">
                            <div class="tech-name">MongoDB</div>
                            <div class="tech-description">NoSQL Database</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" alt="AWS" class="tech-logo">
                            <div class="tech-name">AWS</div>
                            <div class="tech-description">Cloud Platform</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" class="tech-logo">
                            <div class="tech-name">Docker</div>
                            <div class="tech-description">Containerization</div>
                        </div>
                        <div class="tech-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" class="tech-logo">
                            <div class="tech-name">TypeScript</div>
                            <div class="tech-description">Type-Safe JavaScript</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Developer -->
            <div class="developer-card bottom" >
                <div class="developer-info">
                    <div class="greeting">Hello! 👋</div>
                    <h2 class="developer-name">I am <span class="name-highlight">Nikhil Paila</span></h2>
                    <p class="developer-description">
I’m a developer who enjoys building reliable systems and clean user flows.
At SQLTown, I focus on shaping features that make SQL learning practical and intuitive.
I care about clarity, scalability, and building things that actually help users.
                    </p>

                    <a href="#" class="cta-button">Contact →</a>

                                        <script>
                                            document.querySelector('.cta-button').addEventListener('click', function(e) {
                                                e.preventDefault();
                                                window.location.href = 'mailto:pailanikhil30@gmail.com?subject=Contact from SQL Town&body=Hi Swapanth,';
                                            });
                                        </script>

                    <div class="rating-cards">
                        <div class="rating-card">
                            <img src="rootsquare.png" alt="Rootsquare" class="rating-icon upwork" style="width: 36px; height: 36px;object-fit: cover;">
                            <div class="rating-info">
                                <div class="rating-stars">Rootsquare ai</div>
                                <div>
                                    <span class="rating-score">Ex</span>
                                    <span class="rating-label">SDE Intern</span>
                                </div>
                            </div>
                        </div>
                        <div class="rating-card">
                            <img src="bluconn-logo.svg" alt="Bluconn" class="rating-icon upwork" style="width: 36px; height: 36px;">
                            <div class="rating-info">
                                <div class="rating-stars">Bluconn.ai</div>
                                <div>
                                    <span class="rating-score">SDE - 1</span>
                                    <span class="rating-label"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="developer-image-container">
                    
                    <div class="developer-image-frame">
                        <img src="nikhil.png" 
                             alt="Nikhil Paila" 
                             class="developer-image">
                    </div>
                </div>
            </div>

        </div>
    </section>

</body>
</html>
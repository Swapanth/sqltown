<style>
        .page-features {
            padding: 4rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .features-header {
            text-align: center;
            margin-bottom: 5rem;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, rgba(255, 107, 53, 0.15), transparent);
            border: 1.5px solid #FF6B35;
            color: #FF6B35;
            padding: 0.5rem 1.25rem;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 2rem;
            text-transform: uppercase;
        }

        .game-title {
            font-family: 'Bricolage Grotesque', 'Playfair Display', serif;
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            letter-spacing: -0.02em;
            color: #0A0A0A;
        }

        .game-title .highlight {
            color: #FF6B35;
            position: relative;
            display: inline-block;
        }

        .game-subtitle {
            font-size: clamp(1.1rem, 2vw, 1.35rem);
            color: #404040;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.7;
        }

        .game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
        }

        .game-card {
            background: #FFFFFF !important;
            border: 2px solid #E8E8E8;
            padding: 3rem 2.5rem;
            border-radius: 24px;
            position: relative;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 1 !important;
            overflow: hidden;
            min-height: 250px;
        }

        .game-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #FF6B35, #FF8F66);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s ease;
        }

        .game-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at top right, rgba(255, 107, 53, 0.15), transparent 70%);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
        }

        .game-card:hover {
            transform: translateY(-8px);
            border-color: #FF6B35;
            background: #F9F9F9 !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .game-card:hover::before {
            transform: scaleX(1);
        }

        .game-card:hover::after {
            opacity: 1;
        }

        .game-card.animate-in {
            animation: cardFadeIn 0.6s ease-out forwards;
        }

        .game-card.animate-in:nth-child(1) { animation-delay: 0.1s; }
        .game-card.animate-in:nth-child(2) { animation-delay: 0.2s; }
        .game-card.animate-in:nth-child(3) { animation-delay: 0.3s; }
        .game-card.animate-in:nth-child(4) { animation-delay: 0.4s; }

        .game-card-number {
            position: absolute;
            top: 2rem;
            right: 2rem;
            font-family: 'Bricolage Grotesque', 'Playfair Display', serif;
            font-size: 5rem;
            font-weight: 800;
            color: #E8E8E8;
            line-height: 1;
            user-select: none;
            transition: color 0.3s ease;
        }

        .game-card:hover .game-card-number {
            color: rgba(255, 107, 53, 0.3);
        }

        .game-card h4 {
            font-family: 'Bricolage Grotesque', 'Playfair Display', serif;
            font-size: 1.5rem;
            color: #0A0A0A;
            margin-bottom: 1rem;
            font-weight: 700;
            letter-spacing: -0.01em;
            position: relative;
            z-index: 1;
        }

        .game-card p {
            font-size: 1.05rem;
            line-height: 1.7;
            color: #404040;
            position: relative;
            z-index: 1;
        }

        .stat-row {
            display: flex;
            gap: 4rem;
            justify-content: center;
            margin: 6rem 0 4rem;
            flex-wrap: wrap;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-family: 'Bricolage Grotesque', 'Playfair Display', serif;
            font-size: 3.5rem;
            font-weight: 800;
            color: #FF6B35;
            line-height: 1;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 0.95rem;
            color: #404040;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }

        .decorative-line {
            width: 60px;
            height: 3px;
            background: #FF6B35;
            margin: 0 auto 2rem;
            border-radius: 2px;
        }

        @keyframes cardFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .page-features {
                padding: 4rem 1.5rem 6rem;
            }

            .game-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .game-card {
                padding: 2.5rem 2rem;
            }

            .game-card-number {
                font-size: 3.5rem;
                top: 1.5rem;
                right: 1.5rem;
            }

            .stat-row {
                gap: 2rem;
            }

            .stat-number {
                font-size: 2.5rem;
            }
        }

        /* Floating particles animation */
        .features-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: #FF6B35;
            border-radius: 50%;
            opacity: 0.15;
            animation: float 20s infinite;
            pointer-events: none;
        }

        @keyframes float {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.15;
            }
            50% {
                transform: translate(100px, -100px) scale(1.5);
                opacity: 0.05;
            }
        }
    </style>

    <div class="page-features" >
        <header class="features-header">
            <div class="badge">
                <span>Features</span>
            </div>
            <h1 class="game-title">
                Learning disguised as a <span class="highlight">game</span>
            </h1>
            <div class="decorative-line"></div>
            <p class="game-subtitle">
                Master SQL through an immersive city-building experience. 
                No boring tutorials—just pure, addictive gameplay that teaches you database mastery.
            </p>
        </header>

        <div class="stat-row">
            <div class="stat">
                <div class="stat-number">50+</div>
                <div class="stat-label">Quests</div>
            </div>
            <div class="stat">
                <div class="stat-number">∞</div>
                <div class="stat-label">Possibilities</div>
            </div>
            <div class="stat">
                <div class="stat-number">100%</div>
                <div class="stat-label">Fun</div>
            </div>
        </div>

        <section class="game-featuress" >
            <div class="game-grid">
    <div class="game-card">
        <span class="game-card-number">01</span>
        <h4>Quests, Not Lessons</h4>
        <p>Every SQL concept is a mission for your city. Solve real problems, unlock new districts, and level up by doing — not watching.</p>
    </div>
    
    <div class="game-card">
        <span class="game-card-number">02</span>
        <h4>Your City Responds Instantly</h4>
        <p>Run a query and watch the city react in real time. Lights turn on, buildings rise, and mistakes leave visible clues.</p>
    </div>
    
    <div class="game-card">
        <span class="game-card-number">03</span>
        <h4>Learn by Building</h4>
        <p>No memorization. No theory dumps. Just you, a terminal, and a city that only grows when your SQL makes sense.</p>
    </div>
    
    <div class="game-card">
        <span class="game-card-number">04</span>
        <h4>Your Progress Becomes a City</h4>
        <p>Your skyline shows what you’ve mastered. Every building is proof of skill — something you can share, not just claim.</p>
    </div>
</div>

        </section>
    </div>

    <script>
        // Features section animation
        (function() {
            const initFeaturesAnimation = function() {
                const featureCards = document.querySelectorAll('.page-features .game-card');
                
                if (featureCards.length === 0) return;
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                featureCards.forEach(card => {
                    observer.observe(card);
                });
            };
            
            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initFeaturesAnimation);
            } else {
                initFeaturesAnimation();
            }
        })();
    </script>
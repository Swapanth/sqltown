<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Path — SQL Town</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-white: #FEFEFE;
            --text-black: #0A0A0A;
            --text-gray: #4A4A4A;
            --orange: #FF6B35;
            --orange-light: #FFB366;
            --orange-glow: rgba(255, 107, 53, 0.25);
            --gold: #D4AF37;
            --bronze: #CD7F32;
            --silver: #C0C0C0;
            --purple: #8B5CF6;
            --cyan: #06B6D4;
            --green: #10B981;
            --green-dark: #059669;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Crimson Pro', Georgia, serif;
            background: var(--bg-white);
            color: var(--text-black);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .page-container {
            display: flex;
        }

        /* Left Side - Fixed Header */
        .funny-lines {
            position: relative;
            z-index: 1;
        }

        .left-panel {
            width: 40%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 4rem 6rem 4rem 4rem;
           border-right: 1px solid rgba(0, 0, 0, 0.06);
            z-index: 10;
        }

        /* Subtle grid pattern overlay */
        .left-panel::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(0, 0, 0, 0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.015) 1px, transparent 1px);
            background-size: 32px 32px;
            opacity: 0.5;
            pointer-events: none;
        }

        .journey-badge {
            display: inline-block;
            font-family: 'DM Mono', monospace;
            font-size: 0.65rem;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: var(--orange);
            border: 1.5px solid var(--orange);
            padding: 0.6rem 1.4rem;
            border-radius: 100px;
            margin-bottom: 2rem;
            font-weight: 500;
            background: linear-gradient(135deg, rgba(255, 107, 53, 0.04) 0%, rgba(255, 107, 53, 0.08) 100%);
            box-shadow: 0 2px 12px rgba(255, 107, 53, 0.1);
            animation: fadeInDown 1s ease-out;
            position: relative;
            z-index: 1;
        }

        .journey-badge::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1.5px;
            background: linear-gradient(135deg, var(--orange), var(--orange-light));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0.5;
        }

        .journey-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 900;
            line-height: 1.05;
            margin-bottom: 1.5rem;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #0A0A0A 0%, #2A2A2A 50%, #0A0A0A 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: fadeInDown 1.2s ease-out;
            position: relative;
        }

        .journey-subtitle {
            font-size: clamp(1rem, 1.8vw, 1.35rem);
            color: #5A5A5A;
            max-width: 500px;
            line-height: 1.75;
            font-weight: 400;
            animation: fadeInDown 1.4s ease-out;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Right Side - Scrollable Path */
        .right-panel {
            width: 60%;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
        }

        .scroll-wrapper {
            height: 85vh;
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 2rem 1rem;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 107, 53, 0.3) transparent;
        }

        .scroll-wrapper::-webkit-scrollbar {
            width: 6px;
        }

        .scroll-wrapper::-webkit-scrollbar-track {
            background: transparent;
        }

        .scroll-wrapper::-webkit-scrollbar-thumb {
            background: rgba(255, 107, 53, 0.2);
            border-radius: 10px;
            transition: background 0.3s ease;
        }

        .scroll-wrapper::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 107, 53, 0.4);
        }

        .path-container {
            position: relative;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        /* Clean Center Line */
        .path-svg {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 0;
            width: 3px;
            height: 100%;
            z-index: 1;
            pointer-events: none;
            background: linear-gradient(180deg, 
                transparent 0%,
                rgba(0, 0, 0, 0.06) 3%,
                rgba(0, 0, 0, 0.06) 97%,
                transparent 100%
            );
            border-radius: 2px;
        }

        .path-line {
            display: none;
        }

        .path-progress {
            display: none;
        }

        /* Checkpoint Container */
        .checkpoints-list {
            position: relative;
            z-index: 5;
        }

        .checkpoint {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            opacity: 0;
            animation: checkpointAppear 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            min-height: 140px;
        }

        @keyframes checkpointAppear {
            from {
                opacity: 0;
                transform: translateX(-40px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .checkpoint:nth-child(1) { animation-delay: 0.15s; }
        .checkpoint:nth-child(2) { animation-delay: 0.3s; }
        .checkpoint:nth-child(4) { animation-delay: 0.45s; }
        .checkpoint:nth-child(5) { animation-delay: 0.6s; }
        .checkpoint:nth-child(7) { animation-delay: 0.75s; }
        .checkpoint:nth-child(9) { animation-delay: 0.9s; }
        .checkpoint:nth-child(11) { animation-delay: 1.05s; }
        .checkpoint:nth-child(13) { animation-delay: 1.2s; }

        /* Alternate positioning - clean left/right */
        .checkpoint-left .checkpoint-info {
            position: absolute;
            right: 50%;
            margin-right: 60px;
            text-align: right;
        }

        .checkpoint-right .checkpoint-info {
            position: absolute;
            left: 50%;
            margin-left: 60px;
            text-align: left;
        }

        /* Chat Bubble Messages */
        .checkpoint-message {
            position: relative;
            max-width: 220px;
            padding: 0.8rem 1rem;
            border-radius: 15px;
            font-family: 'Crimson Pro', Georgia, serif;
            font-size: 0.85rem;
            line-height: 1.5;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            opacity: 0;
            animation: bubbleAppear 0.6s ease-out forwards;
            animation-delay: 0.4s;
            margin-top: -7rem;
            margin-bottom: 9rem;
        }

        @keyframes bubbleAppear {
            from {
                opacity: 0;
                transform: translateY(-10px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .checkpoint-left + .checkpoint-message {
            margin-left: calc(50% + 65px);
            background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
            color: #2A2A2A;
            border: 1px solid rgba(0, 0, 0, 0.06);
            text-align: left;
        }

        .checkpoint-left + .checkpoint-message::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 20px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 8px 8px 8px 0;
            border-color: transparent #FFFFFF transparent transparent;
        }

        .checkpoint-right + .checkpoint-message {
            margin-right: calc(50% + 65px);
            margin-left: auto;
            background: linear-gradient(135deg, #FFF5EC 0%, #FFE8D6 100%);
            color: #2A2A2A;
            border: 1px solid rgba(255, 107, 53, 0.15);
            text-align: right;
        }

        .checkpoint-right + .checkpoint-message::before {
            content: '';
            position: absolute;
            right: -8px;
            top: 20px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 8px 0 8px 8px;
            border-color: transparent transparent transparent #FFF5EC;
        }

        .checkpoint:hover + .checkpoint-message {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .checkpoint-message-emoji {
            font-size: 1.1rem;
            margin-bottom: 0.4rem;
            display: block;
        }

        /* Checkpoint Circle - Modern */
        .checkpoint-circle {
            position: relative;
            width: 54px;
            height: 54px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 30;
            flex-shrink: 0;
        }

        .checkpoint:hover .checkpoint-circle {
            transform: scale(1.15);
        }

        .checkpoint-bg {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: white;
            border: 3px solid rgba(0, 0, 0, 0.08);
            box-shadow: 
                0 6px 18px rgba(0, 0, 0, 0.08),
                0 2px 6px rgba(0, 0, 0, 0.04);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .checkpoint.completed .checkpoint-bg {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 
                0 12px 40px rgba(16, 185, 129, 0.3),
                0 4px 12px rgba(16, 185, 129, 0.2),
                inset 0 2px 0 rgba(255, 255, 255, 0.4);
        }

        .checkpoint.active .checkpoint-bg {
            background: linear-gradient(135deg, var(--orange) 0%, var(--orange-light) 100%);
            border-color: rgba(255, 107, 53, 0.4);
            animation: activePulse 2.5s ease-in-out infinite;
            box-shadow: 
                0 0 48px rgba(255, 107, 53, 0.4),
                0 12px 40px rgba(255, 107, 53, 0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.4);
        }

        @keyframes activePulse {
            0%, 100% { 
                transform: scale(1);
                box-shadow: 
                    0 0 48px rgba(255, 107, 53, 0.4),
                    0 12px 40px rgba(255, 107, 53, 0.3),
                    inset 0 2px 0 rgba(255, 255, 255, 0.4);
            }
            50% { 
                transform: scale(1.08);
                box-shadow: 
                    0 0 60px rgba(255, 107, 53, 0.5),
                    0 16px 56px rgba(255, 107, 53, 0.35),
                    inset 0 2px 0 rgba(255, 255, 255, 0.5);
            }
        }

        .checkpoint.locked .checkpoint-bg {
            background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%);
            border-color: rgba(0, 0, 0, 0.06);
        }

        /* Checkpoint Content Inside Circle */
        .checkpoint-content {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .checkpoint-number {
            font-family: 'Playfair Display', serif;
            font-size: 1.2rem;
            font-weight: 900;
            margin-bottom: 0;
            color: var(--text-black);
        }

        .checkpoint.completed .checkpoint-number {
            color: white;
            font-size: 1.35rem;
            text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        }

        .checkpoint.completed .checkpoint-number::before {
            content: '✓';
        }

        .checkpoint.active .checkpoint-number {
            color: white;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .checkpoint.locked .checkpoint-number {
            color: #AAAAAA;
        }

        .checkpoint.locked .checkpoint-number::before {
            content: '🔒';
            font-size: 1rem;
        }

        .checkpoint-level {
            font-family: 'DM Mono', monospace;
            font-size: 0.45rem;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            opacity: 0.7;
            margin-top: 0.2rem;
        }

        .checkpoint.completed .checkpoint-level,
        .checkpoint.active .checkpoint-level {
            color: white;
            opacity: 0.9;
        }

        .checkpoint.locked .checkpoint-level {
            color: #AAAAAA;
        }

        /* Checkpoint Info Card - Terminal UI Design */
        .checkpoint-info {
            background: #0D1117;
            border-radius: 10px;
            padding: 0;
            box-shadow: 
                0 2px 4px rgba(0, 0, 0, 0.3),
                0 8px 28px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
            width: 100%;
            max-width: 300px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
            font-family: 'DM Mono', 'Courier New', monospace;
        }

        /* Terminal Header Bar */
        .checkpoint-info::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 28px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1;
        }

        /* Terminal Buttons */
        .checkpoint-info::after {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            width: 10px;
            height: 10px;
            background: #FF5F56;
            border-radius: 50%;
            box-shadow: 
                16px 0 0 #FFBD2E,
                32px 0 0 #27C93F;
            z-index: 2;
        }

        .checkpoint:hover .checkpoint-info {
            transform: translateY(-8px);
            box-shadow: 
                0 4px 8px rgba(0, 0, 0, 0.4),
                0 16px 48px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 107, 53, 0.4);
        }

        /* Terminal Content Wrapper */
        .checkpoint-title,
        .checkpoint-description,
        .checkpoint-meta {
            position: relative;
            z-index: 3;
        }

        .checkpoint-title {
            font-family: 'DM Mono', 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #58A6FF;
            letter-spacing: 0;
            line-height: 1.3;
            padding: 38px 1.2rem 0 1.2rem;
            text-shadow: 0 0 20px rgba(88, 166, 255, 0.3);
        }

        /* Terminal Prompt Symbol */
        .checkpoint-title::before {
            content: '$ ';
            color: #7EE787;
            margin-right: 0.5rem;
        }

        .checkpoint.completed .checkpoint-title {
            color: #7EE787;
            text-shadow: 0 0 20px rgba(126, 231, 135, 0.4);
        }

        .checkpoint.completed .checkpoint-title::before {
            content: '✓ ';
            color: #7EE787;
        }

        .checkpoint.active .checkpoint-title {
            color: #FFA657;
            text-shadow: 0 0 20px rgba(255, 166, 87, 0.4);
        }

        .checkpoint.active .checkpoint-title::before {
            content: '> ';
            color: #FFA657;
            animation: blink 1.2s infinite;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }

        .checkpoint.locked .checkpoint-title {
            color: #6E7681;
            text-shadow: none;
        }

        .checkpoint.locked .checkpoint-title::before {
            content: '# ';
            color: #6E7681;
        }

        .checkpoint.locked .checkpoint-info {
            background: #0D1117;
            border-color: rgba(255, 255, 255, 0.06);
            opacity: 0.6;
        }

        .checkpoint-description {
            font-family: 'DM Mono', 'Courier New', monospace;
            font-size: 0.8rem;
            line-height: 1.6;
            color: #C9D1D9;
            margin-bottom: 1rem;
            padding: 0 1.2rem;
            opacity: 0.85;
        }

        .checkpoint.locked .checkpoint-description {
            color: #6E7681;
        }

        .checkpoint-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.2rem 1.2rem 1.2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(0, 0, 0, 0.2);
        }

        .checkpoint-badge {
            font-family: 'DM Mono', monospace;
            font-size: 0.6rem;
            letter-spacing: 0.4px;
            padding: 0.4rem 0.8rem;
            border-radius: 5px;
            font-weight: 500;
            text-transform: uppercase;
            transition: all 0.3s ease;
            border: 1px solid;
        }

        .checkpoint.completed .checkpoint-badge {
            background: rgba(126, 231, 135, 0.1);
            color: #7EE787;
            border-color: rgba(126, 231, 135, 0.3);
            box-shadow: 0 0 12px rgba(126, 231, 135, 0.2);
        }

        .checkpoint.active .checkpoint-badge {
            background: rgba(255, 166, 87, 0.1);
            color: #FFA657;
            border-color: rgba(255, 166, 87, 0.3);
            box-shadow: 0 0 12px rgba(255, 166, 87, 0.2);
        }

        .checkpoint.locked .checkpoint-badge {
            background: rgba(110, 118, 129, 0.1);
            color: #6E7681;
            border-color: rgba(110, 118, 129, 0.3);
        }

        .checkpoint-theme {
            font-size: 0.75rem;
            color: #8B949E;
            font-weight: 400;
            font-family: 'DM Mono', monospace;
        }

        /* Theme Dividers - Subtle & Refined */
        .theme-divider {
            position: relative;
            text-align: center;
            margin: 2.5rem 0;
            padding: 0;
            opacity: 0;
            animation: fadeIn 0.9s ease-out forwards;
        }

        .theme-divider:nth-of-type(3) { animation-delay: 0.4s; }
        .theme-divider:nth-of-type(6) { animation-delay: 0.7s; }
        .theme-divider:nth-of-type(8) { animation-delay: 1s; }
        .theme-divider:nth-of-type(10) { animation-delay: 1.3s; }
        .theme-divider:nth-of-type(12) { animation-delay: 1.6s; }
        .theme-divider:nth-of-type(14) { animation-delay: 1.9s; }

        @keyframes fadeIn {
            to { opacity: 1; }
        }

        /* Portal/Gateway Effect (minimal) */
        .theme-divider::before {
            display: none;
        }

        @keyframes portalPulse {
            0%, 100% { 
                transform: translate(-50%, -50%) scale(1);
                opacity: 0.15; /* very muted */
            }
            50% { 
                transform: translate(-50%, -50%) scale(1.08); /* tiny pulse */
                opacity: 0.08;
            }
        }

        /* Realm Border Lines (hidden in new design) */
        .theme-divider-line {
            display: none;
        }

        .theme-label {
            display: inline-block;
            font-family: 'DM Mono', monospace;
            font-size: 0.65rem;
            font-weight: 500;
            color: var(--orange);
            text-transform: uppercase;
            letter-spacing: 1.8px;
            padding: 0.4rem 1rem;
            background: rgba(255, 107, 53, 0.06);
            border: 1px solid rgba(255, 107, 53, 0.15);
            border-radius: 100px;
            position: relative;
            z-index: 20;
        }

        @keyframes labelFloat {
            0%, 100% { 
                transform: translateY(0);
            }
            50% { 
                transform: translateY(-2px);
            }
        }

        /* Icon decoration (hidden) */
        .theme-label::before,
        .theme-label::after {
            display: none;
        }

        @keyframes iconFloat {
            0%, 100% { 
                transform: translateY(-50%) rotate(0deg) scale(1);
            }
            50% { 
                transform: translateY(-60%) rotate(180deg) scale(1.1);
            }
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .left-panel {
                width: 45%;
                padding: 3rem 4rem 3rem 3rem;
            }

            .right-panel {
                margin-left: 45%;
                width: 55%;
            }

            .journey-title {
                font-size: 3rem;
            }

            .path-container {
                max-width: 900px;
            }

            .checkpoint {
                gap: 2rem;
                margin-bottom: 3rem;
            }

            .checkpoint-info {
                max-width: 320px;
                padding: 0;
            }
        }

        @media (max-width: 768px) {
            .page-container {
                flex-direction: column;
            }

            .left-panel {
                position: relative;
                width: 100%;
                height: auto;
                padding: 3rem 2rem;
                border-right: none;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            }

            .right-panel {
                position: relative;
                margin-left: 0;
                width: 100%;
                padding: 2rem 1rem;
                height: auto;
            }

            .scroll-wrapper {
                height: auto;
                overflow-y: visible;
                padding: 1rem 0.5rem;
            }

            .path-container {
                max-width: 100%;
                padding: 2rem 0;
            }

            .checkpoint {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1.5rem;
                margin-bottom: 3rem;
                min-height: auto;
            }

            .checkpoint:nth-of-type(odd),
            .checkpoint:nth-of-type(even) {
                justify-content: center;
            }

            .checkpoint-left + .checkpoint-message,
            .checkpoint-right + .checkpoint-message {
                position: relative;
                left: auto;
                right: auto;
                margin: 1rem auto 0 auto;
                max-width: 100%;
                text-align: center;
            }

            .checkpoint-left + .checkpoint-message::before,
            .checkpoint-right + .checkpoint-message::before {
                display: none;
            }

            .checkpoint-left .checkpoint-info,
            .checkpoint-right .checkpoint-info {
                position: relative;
                right: auto;
                left: auto;
                order: unset;
                margin: 0 auto;
                text-align: center;
                max-width: 100%;
            }

            .checkpoint-info {
                max-width: 420px;
                padding: 0;
            }

            .checkpoint-circle {
                position: relative;
                margin-bottom: 0;
            }

            .path-svg {
                display: none;
            }
        }
    </style>
</head>
<body>


    <div class="page-container">
        <!-- Left Panel - Fixed Header -->
        <div class="left-panel">
            <div class="journey-badge">Your Quest</div>
            <h1 class="journey-title">The Path to Mastery</h1>
            <p class="journey-subtitle">
                Seven checkpoints. Four realms. One legendary journey from novice to SQL architect.
            </p>
            <p style="margin-top: 2rem; font-size: 0.9rem; color: #5A5A5A; font-family: 'DM Mono', monospace; border: 1px solid rgba(0, 0, 0, 0.06); padding: 0.6rem 1.2rem; border-radius: 5px; background: rgba(255, 107, 53, 0.04);">
                Scroll down here to view all levels ->
            </p>
        </div>

        <!-- Right Panel - Scrollable Path -->
        <div class="right-panel">
            <div class="scroll-wrapper">
                <div class="path-container">
                <!-- Clean Center Line -->
                <div class="path-svg"></div>

                <div class="checkpoints-list">
                    <!-- Checkpoint 1: Completed -->
                    <div class="checkpoint completed checkpoint-left">
                        <div class="checkpoint-circle">
                            <div class="checkpoint-bg"></div>
                            <div class="checkpoint-content">
                                <div class="checkpoint-number"></div>
                                <div class="checkpoint-level">LVL 1-5</div>
                            </div>
                        </div>
                        <div class="checkpoint-info">
                            <h3 class="checkpoint-title">Hello World</h3>
                            <p class="checkpoint-description">
                                Your first steps into SQL. Master SELECT, FROM, and WHERE. Query your first database.
                            </p>
                            <div class="checkpoint-meta">
                                <span class="checkpoint-badge">Completed</span>
                                <span class="checkpoint-theme">🌱 Beginner</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkpoint-message">
                        <span class="checkpoint-message-emoji">🎉</span>
                        "Welcome, brave adventurer! Your SQL journey begins with a single SELECT statement."
                    </div>

                    <!-- Theme Divider 1 -->
                    <div class="theme-divider">
                        <div class="theme-divider-line"></div>
                        <div class="theme-label">First Steps</div>
                    </div>

                    <!-- Checkpoint 2: Completed -->
                    <div class="checkpoint completed checkpoint-right">
                        <div class="checkpoint-circle">
                            <div class="checkpoint-bg"></div>
                            <div class="checkpoint-content">
                                <div class="checkpoint-number"></div>
                                <div class="checkpoint-level">LVL 6-12</div>
                            </div>
                        </div>
                        <div class="checkpoint-info">
                            <h3 class="checkpoint-title">First Village</h3>
                            <p class="checkpoint-description">
                                Build your foundations. CREATE tables, INSERT data, UPDATE records. Shape data into information.
                            </p>
                            <div class="checkpoint-meta">
                                <span class="checkpoint-badge">Completed</span>
                                <span class="checkpoint-theme">🏘️ Builder</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkpoint-message">
                        <span class="checkpoint-message-emoji">🏗️</span>
                        "Why do SQL developers prefer cities? Because they love creating TABLE after TABLE!"
                    </div>

                    <!-- Theme Divider 2 -->

                    <!-- Checkpoint 3: Active -->
                    <div class="checkpoint active checkpoint-left">
                        <div class="checkpoint-circle">
                            <div class="checkpoint-bg"></div>
                            <div class="checkpoint-content">
                                <div class="checkpoint-number">3</div>
                                <div class="checkpoint-level">LVL 13-20</div>
                            </div>
                        </div>
                        <div class="checkpoint-info">
                            <h3 class="checkpoint-title">Growing Town</h3>
                            <p class="checkpoint-description">
                                Connect the pieces. Master JOINs, relationships, and foreign keys. Transform data into an ecosystem.
                            </p>
                            <div class="checkpoint-meta">
                                <span class="checkpoint-badge">In Progress</span>
                                <span class="checkpoint-theme">🔗 Connector</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkpoint-message">
                        <span class="checkpoint-message-emoji">🔗</span>
                        "Fun fact: A JOIN walks into a bar, sees two tables, and says 'Mind if I JOIN you?'"
                    </div>
                    <div class="theme-divider">
                        <div class="theme-divider-line"></div>
                        <div class="theme-label">Connection Phase</div>
                    </div>

                    <!-- Checkpoint 4 -->
                    <div class="checkpoint checkpoint-right">
                        <div class="checkpoint-circle">
                            <div class="checkpoint-bg"></div>
                            <div class="checkpoint-content">
                                <div class="checkpoint-number">4</div>
                                <div class="checkpoint-level">LVL 21-30</div>
                            </div>
                        </div>
                        <div class="checkpoint-info">
                            <h3 class="checkpoint-title">City Builder</h3>
                            <p class="checkpoint-description">
                                Scale your knowledge. Subqueries, indexes, optimization. Build databases that handle thousands of queries.
                            </p>
                            <div class="checkpoint-meta">
                                <span class="checkpoint-badge">Next Quest</span>
                                <span class="checkpoint-theme">⚡ Optimizer</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkpoint-message">
                        <span class="checkpoint-message-emoji">⚡</span>
                        "SQL pro tip: An index is like a book's table of contents — saves you from reading every page!"
                    </div>
                    <div class="theme-divider">
                        <div class="theme-divider-line"></div>
                        <div class="theme-label">Advanced Territory</div>
                    </div>

                    <!-- Checkpoint 5 -->
                    <div class="checkpoint checkpoint-left">
                        <div class="checkpoint-circle">
                            <div class="checkpoint-bg"></div>
                            <div class="checkpoint-content">
                                <div class="checkpoint-number">5</div>
                                <div class="checkpoint-level">LVL 31-40</div>
                            </div>
                        </div>
                        <div class="checkpoint-info">
                            <h3 class="checkpoint-title">Architect</h3>
                            <p class="checkpoint-description">
                                Design at scale. Advanced patterns, performance tuning, architectural decisions.
                            </p>
                            <div class="checkpoint-meta">
                                <span class="checkpoint-badge">Awaiting</span>
                                <span class="checkpoint-theme">🏛️ Designer</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkpoint-message">
                        <span class="checkpoint-message-emoji">🏛️</span>
                        "Remember: Premature optimization is the root of all evil, but knowing when to optimize is art."
                    </div>
                    <div class="theme-divider">
                        <div class="theme-divider-line"></div>
                        <div class="theme-label">Architecture Realm</div>
                    </div>

                    <!-- Checkpoint 6: Locked -->
                    <div class="checkpoint locked checkpoint-right">
                        <div class="checkpoint-circle">
                            <div class="checkpoint-bg"></div>
                            <div class="checkpoint-content">
                                <div class="checkpoint-number"></div>
                                <div class="checkpoint-level">LVL 41-50</div>
                            </div>
                        </div>
                        <div class="checkpoint-info">
                            <h3 class="checkpoint-title">Database Master</h3>
                            <p class="checkpoint-description">
                                Enterprise expertise. Transactions, concurrency, replication. Handle mission-critical systems.
                            </p>
                            <div class="checkpoint-meta">
                                <span class="checkpoint-badge">Locked</span>
                                <span class="checkpoint-theme">💎 Expert</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkpoint-message">
                        <span class="checkpoint-message-emoji">💎</span>
                        "A database admin's favorite dance? The TRANSACTION — it's all about commitment!"
                    </div>
                    <div class="theme-divider">
                        <div class="theme-divider-line"></div>
                        <div class="theme-label">Master's Domain</div>
                    </div>

                    <!-- Checkpoint 7: Locked -->
                    <div class="checkpoint locked checkpoint-left">
                        <div class="checkpoint-circle">
                            <div class="checkpoint-bg"></div>
                            <div class="checkpoint-content">
                                <div class="checkpoint-number"></div>
                                <div class="checkpoint-level">LVL 51+</div>
                            </div>
                        </div>
                        <div class="checkpoint-info">
                            <h3 class="checkpoint-title">SQL Legend</h3>
                            <p class="checkpoint-description">
                                The pinnacle of mastery. Distributed systems, global scaling, architectural wizardry.
                            </p>
                            <div class="checkpoint-meta">
                                <span class="checkpoint-badge">Locked</span>
                                <span class="checkpoint-theme">👑 Legendary</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkpoint-message">
                        <span class="checkpoint-message-emoji">👑</span>
                        "Legendary truth: There are only two hard things in CS — cache invalidation and naming things."
                    </div>
            </div>
        </div>
    </div>

</div>
</div>
     <!-- <div class="">
        <h1 class="">Embark on Your SQL Journey</h1>
    </div> -->
    
</body>
</html>
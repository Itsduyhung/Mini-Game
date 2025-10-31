import React, { useEffect } from 'react';
import './App.css';

function App() {
    useEffect(() => {
        const state = {
            screen: 'intro',
            currentPart: 1, // 1: Thủ tướng, 2: Thủ tướng Quốc tế, 3: Chủ tịch Chaebol
            budget: 100,
            investments: {
                state: 0,
                chaebols: 0,
                welfare: 0,
                tech: 0
            },
            stats: {
                gdp: 35.0,
                equality: 35.0,
                trust: 35.0,
                international: 50.0
            },
            // Stats riêng cho Part 3 - Chaebol
            chaebollStats: {
                profit: 35.0,
                reputation: 35.0,
                government: 35.0,
                market: 35.0
            },
            round: 1,
            maxRounds: 10,
            news: [],
            events: [],
            totalInvested: {
                state: 0,
                chaebols: 0,
                welfare: 0,
                tech: 0
            },
            alliance: null,
            phase: 1, // 1: Domestic (rounds 1-5), 2: International (rounds 6-10)
            storyContext: {
                currentEvent: 'covid_crisis',
                timeline: []
            },
            // Kết quả của các parts
            partResults: {
                part1: null, // Kết quả Part 1
                part2: null, // Kết quả Part 2  
                part3: null  // Kết quả Part 3
            },
            // Academic slides
            academicSlide: 1
        };

        const investmentOptions = [
            {
                id: 'state',
                name: 'Doanh nghiệp Nhà nước',
                icon: '🏭',
                color: '#93c5fd',
                description: 'Ổn định, kiểm soát lạm phát',
                baseEffects: { gdp: 2.0, equality: 8.5, trust: 7.0, international: 2.0 },
                directPenalties: { gdp: -1.0, trust: -1.5 }, // Hiệu quả thấp + quan liêu
                news: 'Nhà nước mở rộng sản xuất, tạo việc làm ổn định!'
            },
            {
                id: 'chaebols',
                name: 'Tập đoàn Tư bản',
                icon: '🏢',
                color: '#fbbf24',
                description: 'Phục hồi nhanh, xuất khẩu mạnh',
                baseEffects: { gdp: 12.0, equality: -8.5, trust: 3.5, international: 6.0 },
                directPenalties: { trust: -2.0 }, // Giảm niềm tin do bất bình đẳng
                news: 'Samsung & Hyundai tăng trưởng vượt bậc, xuất khẩu tăng 30%!'
            },
            {
                id: 'welfare',
                name: 'Trợ cấp Dân sinh',
                icon: '👨‍👩‍👧‍👦',
                color: '#f9a8d4',
                description: 'Ổn định xã hội, giảm bất mãn',
                baseEffects: { gdp: -4.0, equality: 15.0, trust: 10.0, international: -2.0 },
                directPenalties: { gdp: -2.0 }, // Gánh nặng ngân sách
                news: 'Người dân hài lòng với chính sách phúc lợi mới!'
            },
            {
                id: 'tech',
                name: 'Công nghệ & R&D',
                icon: '💻',
                color: '#86efac',
                description: 'Tăng năng suất lâu dài',
                baseEffects: { gdp: 7.0, equality: 3.5, trust: 5.5, international: 4.0 },
                directPenalties: { equality: -1.5, trust: -1.0 }, // Khoảng cách kỹ năng + thất nghiệp
                news: 'Đầu tư công nghệ mở ra kỷ nguyên đổi mới sáng tạo!'
            }
        ];

        const allianceOptions = [
            {
                id: 'usa',
                name: 'Liên minh Mỹ',
                icon: '🇺🇸',
                color: '#3b82f6',
                description: 'Công nghệ cao, thị trường lớn, nhưng áp lực chính trị',
                effects: { gdp: 8.0, equality: -3.0, trust: 5.0, international: 12.0 },
                consequences: 'Trung Quốc áp đặt hạn chế thương mại, căng thẳng khu vực tăng',
                lesson: 'Liên minh với siêu cường mang lại lợi ích kinh tế nhưng có thể gây xung đột địa chính trị'
            },
            {
                id: 'china',
                name: 'Liên minh Trung Quốc',
                icon: '🇨🇳',
                color: '#ef4444',
                description: 'Thị trường khổng lồ, đầu tư hạ tầng, nhưng phụ thuộc cao',
                effects: { gdp: 10.0, equality: 2.0, trust: -2.0, international: 8.0 },
                consequences: 'Mỹ và đồng minh áp đặt trừng phạt, công nghệ bị hạn chế',
                lesson: 'Phụ thuộc vào một thị trường lớn có thể tạo ra rủi ro địa chính trị nghiêm trọng'
            },
            {
                id: 'eu',
                name: 'Liên minh EU',
                icon: '🇪🇺',
                color: '#10b981',
                description: 'Cân bằng, bền vững, nhưng tăng trưởng chậm',
                effects: { gdp: 5.0, equality: 6.0, trust: 8.0, international: 6.0 },
                consequences: 'Tăng trưởng ổn định nhưng chậm, cạnh tranh với các cường quốc khác',
                lesson: 'Con đường trung dung mang lại ổn định nhưng có thể bỏ lỡ cơ hội tăng trưởng nhanh'
            },
            {
                id: 'independent',
                name: 'Tự chủ kinh tế',
                icon: '🏴',
                color: '#8b5cf6',
                description: 'Độc lập, linh hoạt, nhưng thiếu nguồn lực',
                effects: { gdp: 2.0, equality: 4.0, trust: 10.0, international: -5.0 },
                consequences: 'Phát triển chậm, khó cạnh tranh, nhưng giữ được chủ quyền',
                lesson: 'Tự chủ kinh tế bảo vệ chủ quyền nhưng có thể dẫn đến tụt hậu so với thế giới'
            }
        ];

        // Part 3: Chaebol Strategy Options
        const chaebollOptions = [
            {
                id: 'lobby',
                name: 'Vận động hành lang',
                icon: '🤝',
                color: '#f59e0b',
                description: 'Thuyết phục chính trị gia, tạo quan hệ',
                baseEffects: { profit: 2.0, reputation: -3.0, government: 8.0, market: 1.0 },
                news: 'Samsung tăng cường hoạt động vận động chính sách!',
                vision: 'Trong 5 năm tới, mối quan hệ với chính phủ sẽ mở ra nhiều dự án lớn, nhưng dư luận có thể phản ứng tiêu cực về "thông đồng quyền lực".',
                lesson: 'Vận động hành lang là công cụ quyền lực của tư bản độc quyền để ảnh hưởng chính sách nhà nước.'
            },
            {
                id: 'innovation',
                name: 'Đầu tư R&D',
                icon: '🔬',
                color: '#10b981',
                description: 'Nghiên cứu công nghệ tiên tiến',
                baseEffects: { profit: 6.0, reputation: 7.0, government: 3.0, market: 8.0 },
                news: 'Samsung ra mắt công nghệ đột phá, dẫn đầu thị trường!',
                vision: 'Đầu tư R&D sẽ tạo ra lợi thế cạnh tranh bền vững, nâng cao uy tín quốc tế và thu hút nhân tài hàng đầu.',
                lesson: 'Đổi mới công nghệ là cách tập đoàn lớn duy trì vị thế độc quyền trong nền kinh tế tri thức.'
            },
            {
                id: 'expansion',
                name: 'Mở rộng thị trường',
                icon: '🌍',
                color: '#3b82f6',
                description: 'Đầu tư nước ngoài, M&A',
                baseEffects: { profit: 10.0, reputation: 2.0, government: -2.0, market: 6.0 },
                news: 'Samsung thâu tóm công ty công nghệ Mỹ, mở rộng toàn cầu!',
                vision: 'Chiến lược toàn cầu hóa sẽ đưa Samsung thành "quốc gia trong quốc gia", nhưng có thể gây lo ngại về an ninh kinh tế.',
                lesson: 'Xuất khẩu tư bản và M&A xuyên biên giới là đặc trưng của chủ nghĩa tư bản độc quyền hiện đại.'
            },
            {
                id: 'social',
                name: 'Trách nhiệm xã hội',
                icon: '❤️',
                color: '#ec4899',
                description: 'Từ thiện, môi trường, lao động',
                baseEffects: { profit: -3.0, reputation: 10.0, government: 5.0, market: 2.0 },
                news: 'Samsung cam kết carbon trung tính, tăng lương công nhân!',
                vision: 'Đầu tư CSR sẽ cải thiện hình ảnh công chúng và giảm áp lực pháp lý, tạo nền tảng phát triển bền vững.',
                lesson: 'CSR là cách tập đoàn lớn "hợp pháp hóa" sự tồn tại và giảm mâu thuẫn với xã hội.'
            }
        ];

        const storyEvents = {
            covid_crisis: {
                title: '🦠 Đại dịch COVID-19 (2020-2022)',
                description: 'Hàn Quốc đối mặt với cuộc khủng hoảng kép: sức khỏe cộng đồng và suy thoái kinh tế. GDP giảm 0.9%, thất nghiệp tăng cao, các chaebol như Samsung, LG gặp khó khăn. Chính phủ phải lựa chọn giữa phong tỏa nghiêm ngặt và duy trì hoạt động kinh tế.',
                context: 'Đây là thời điểm then chốt để hiểu "chủ nghĩa tư bản độc quyền nhà nước" - khi khủng hoảng xảy ra, Nhà nước và tư bản lớn buộc phải hợp tác để sinh tồn.',
                lesson: 'Trong khủng hoảng, ranh giới giữa Nhà nước và tư bản trở nên mờ nhạt. Cả hai đều cần nhau để vượt qua thử thách.'
            },
            international_pressure: {
                title: '🌏 Căng thẳng địa chính trị (2022-2024)',
                description: 'Cuộc chiến thương mại Mỹ-Trung leo thang. Hàn Quốc bị kẹt giữa hai siêu cường: Mỹ là đồng minh an ninh, Trung Quốc là đối tác thương mại lớn nhất. Áp lực chọn phe ngày càng tăng.',
                context: 'Đây là biểu hiện của "xuất khẩu tư bản" và "phân chia thị trường toàn cầu" mà Lênin đã dự đoán - các cường quốc tranh giành ảnh hưởng kinh tế.',
                lesson: 'Trong thời đại toàn cầu hóa, không có quốc gia nào có thể hoàn toàn độc lập. Mọi lựa chọn đều có cái giá địa chính trị.'
            }
        };

        const randomEvents = [
            {
                name: '🌍 Khủng hoảng năng lượng toàn cầu',
                effects: { gdp: -6.5, equality: -4.0, trust: -7.5, international: -3.0 },
                description: 'Giá dầu tăng vọt, lạm phát leo thang!'
            },
            {
                name: '📱 Cuộc chiến thương mại Mỹ-Trung',
                effects: { gdp: -8.5, equality: 0, trust: -6.0, international: -8.0 },
                description: 'Xuất khẩu công nghệ bị ảnh hưởng nặng nề!'
            },
            {
                name: '🦠 Biến thể COVID mới xuất hiện',
                effects: { gdp: -10.0, equality: -6.0, trust: -8.5, international: -5.0 },
                description: 'Phong tỏa cục bộ, kinh tế đình trệ!'
            },
            {
                name: '🏭 Đình công lao động quy mô lớn',
                effects: { gdp: -7.0, equality: 3.5, trust: -10.0, international: -2.0 },
                description: 'Công nhân yêu cầu tăng lương, cải thiện điều kiện!'
            },
            {
                name: '💰 Bê bối tham nhũng chính trị',
                effects: { gdp: -3.5, equality: -7.0, trust: -15.0, international: -6.0 },
                description: 'Niềm tin công chúng sụp đổ nghiêm trọng!'
            },
            {
                name: '🚀 Bắc Triều Tiên thử tên lửa',
                effects: { gdp: -5.0, equality: 0, trust: -8.0, international: -10.0 },
                description: 'Căng thẳng an ninh khu vực, đầu tư nước ngoài giảm!'
            },
            {
                name: '🏦 Khủng hoảng ngân hàng địa phương',
                effects: { gdp: -9.0, equality: -5.0, trust: -12.0, international: -4.0 },
                description: 'Một số ngân hàng nhỏ phá sản, hoảng loạn tài chính!'
            },
            {
                name: '🌊 Thảm họa thiên nhiên',
                effects: { gdp: -8.0, equality: -6.0, trust: 2.0, international: 1.0 },
                description: 'Bão lớn tàn phá, nhưng tinh thần đoàn kết tăng cao!'
            }
        ];

        function render() {
            const app = document.getElementById('app');
            if (!app) {
                console.error('App element not found!');
                return;
            }
            
            switch(state.screen) {
                case 'intro':
                    app.innerHTML = renderIntro();
                    break;
                case 'academic':
                    app.innerHTML = renderAcademic();
                    break;
                case 'part2_intro':
                    app.innerHTML = renderPart2Intro();
                    break;
                case 'part3_intro':
                    app.innerHTML = renderPart3Intro();
                    break;
                case 'game':
                    app.innerHTML = renderGame();
                    break;
                case 'result':
                    app.innerHTML = renderResult();
                    break;
                case 'analysis':
                    app.innerHTML = renderAnalysis();
                    break;
                case 'final':
                    app.innerHTML = renderFinal();
                    break;
                case 'final_summary':
                    app.innerHTML = renderFinalSummary();
                    break;
            }
        }

        function renderIntro() {
            const currentStory = storyEvents[state.storyContext.currentEvent];
            return `
                <div class="card intro-container fade-in">
                    <div class="icon-large bounce">💰</div>
                    <h1 class="intro-title" style="color: #667eea;">
                        Cứu Quốc bằng Tư Bản
                    </h1>
                    
                    <!-- Ngữ cảnh câu chuyện -->
                    <div class="story-box">
                        <h3 class="story-title">${currentStory.title}</h3>
                        <p class="story-description">
                            ${currentStory.description}
                        </p>
                        <div class="theory-context">
                            <p class="theory-text">
                                💡 <strong>Bối cảnh lý thuyết:</strong> ${currentStory.context}
                            </p>
                        </div>
                    </div>

                    <div class="intro-info">
                        <p>🎮 Trải nghiệm <strong>3 góc nhìn</strong> về kinh tế chính trị!</p>
                        <p>Ngân sách: <span class="budget-highlight">100 điểm/vòng</span> × <span class="round-highlight">5 vòng/giai đoạn</span></p>
                        <p style="margin-bottom: 24px;">Nhiệm vụ: <strong>Vượt qua 3 giai đoạn thử thách khác nhau!</strong></p>
                    </div>
                    
                    <div class="phase-grid">
                        <div class="phase-card green">
                            <h3 class="phase-title">🏠 Giai đoạn 1: Nội chính</h3>
                            <ul class="phase-list">
                                <li>🏭 Cân bằng Nhà nước vs Tư bản</li>
                                <li>👥 Chăm sóc dân sinh vs Tăng trưởng</li>
                                <li>💻 Đầu tư công nghệ dài hạn</li>
                                <li>⚡ Đối phó sự kiện bất ngờ</li>
                            </ul>
                        </div>
                        
                        <div class="phase-card blue">
                            <h3 class="phase-title">🌏 Giai đoạn 2: Quốc tế</h3>
                            <ul class="phase-list">
                                <li>🇺🇸 Chọn liên minh: Mỹ, Trung, EU?</li>
                                <li>🏴 Hay tự chủ kinh tế?</li>
                                <li>📊 Quản lý 4 chỉ số: GDP, Công bằng, Niềm tin, Quốc tế</li>
                                <li>🎯 Mục tiêu: 85+ điểm cho tất cả!</li>
                            </ul>
                        </div>
                        
                        <div class="phase-card purple">
                            <h3 class="phase-title">🏢 Giai đoạn 3: Chaebol</h3>
                            <ul class="phase-list">
                                <li>💰 Trở thành Chủ tịch Samsung</li>
                                <li>🤝 Vận động hành lang chính trị</li>
                                <li>🔬 Đầu tư R&D và mở rộng</li>
                                <li>⭐ Mục tiêu: 85+ điểm tất cả chỉ số!</li>
                            </ul>
                        </div>
                    </div>

                    <div class="learning-box">
                        <h3 class="learning-title">🎓 Bạn sẽ học được gì?</h3>
                        <ul class="learning-list">
                            <li>✅ <strong>Chủ nghĩa tư bản độc quyền nhà nước</strong> hoạt động như thế nào</li>
                            <li>✅ Tại sao Nhà nước và tập đoàn lớn "cần" nhau trong khủng hoảng</li>
                            <li>✅ <strong>Xuất khẩu tư bản</strong> và cạnh tranh địa chính trị toàn cầu</li>
                            <li>✅ Hậu quả của việc phụ thuộc vào các siêu cường</li>
                            <li>✅ Cái giá của tăng trưởng kinh tế và công bằng xã hội</li>
                        </ul>
                    </div>

                    <div class="difficulty-box">
                        <h3 class="difficulty-title">⚡ Độ khó cao!</h3>
                        <ul class="difficulty-list">
                            <li>🔥 Điểm khởi đầu thấp: chỉ <strong>35 điểm</strong> mỗi chỉ số</li>
                            <li>🎲 Sự kiện ngẫu nhiên có thể phá hỏng kế hoạch</li>
                            <li>📉 Hiệu quả giảm dần (diminishing returns)</li>
                            <li>🔗 Cần kết hợp thông minh để tạo synergy</li>
                            <li>🌍 Lựa chọn quốc tế ảnh hưởng lâu dài</li>
                        </ul>
                    </div>

                    <div class="intro-buttons">
                        <button onclick="showAcademicModal()" class="academic-info-btn">
                            📚 Nội dung học thuật
                        </button>
                        <button onclick="startGame()" class="academic-btn">
                            🚀 Bắt đầu nhiệm kỳ lãnh đạo!
                        </button>
                    </div>
                </div>
            `;
        }

        function renderGame() {
            if (state.currentPart === 3) {
                return renderChaebollGame();
            }
            
            const phaseTitle = state.currentPart === 1 ? '🏠 Giai đoạn 1: Nội chính' : 
                              state.currentPart === 2 ? '🌏 Giai đoạn 2: Quốc tế' : 
                              '🏢 Giai đoạn 3: Chaebol';
            
            return `
                <div class="game-container fade-in">
                    <div class="card game-card">
                        <div class="game-header">
                            <div class="game-header-left">
                                <h2>
                                    Part ${state.currentPart} - Vòng ${state.round}/${state.maxRounds}
                                </h2>
                                <p>${phaseTitle}</p>
                            </div>
                            <div class="game-budget">
                                💰 Ngân sách: <span id="budget">${state.budget}</span> điểm
                            </div>
                        </div>

                        <div class="stats-grid cols-${state.currentPart === 1 ? '3' : '4'}">
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>📈 GDP</span>
                                    <span>${state.stats.gdp.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.stats.gdp}%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>⚖️ Công bằng</span>
                                    <span>${state.stats.equality.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.stats.equality}%; background: linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>💬 Niềm tin</span>
                                    <span>${state.stats.trust.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.stats.trust}%; background: linear-gradient(90deg, #f59e0b, #fbbf24);"></div>
                                </div>
                            </div>
                            ${state.currentPart !== 1 ? `
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>🌍 Quốc tế</span>
                                    <span>${state.stats.international.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.stats.international}%; background: linear-gradient(90deg, #8b5cf6, #a78bfa);"></div>
                                </div>
                            </div>
                            ` : ''}
                        </div>

                        ${state.alliance ? `
                            <div class="info-box purple">
                                <strong>🤝 Liên minh hiện tại:</strong> 
                                <span>${allianceOptions.find(a => a.id === state.alliance)?.icon} ${allianceOptions.find(a => a.id === state.alliance)?.name}</span>
                            </div>
                        ` : ''}

                        ${state.news.length > 0 ? `
                            <div class="news-ticker">
                                <strong>📰 Tin tức:</strong> ${state.news[state.news.length - 1]}
                            </div>
                        ` : ''}

                        ${state.events.length > 0 ? `
                            <div class="info-box red">
                                <strong>⚠️ Sự kiện khẩn cấp:</strong> 
                                <span>${state.events[state.events.length - 1]}</span>
                            </div>
                        ` : ''}
                    </div>

                    ${state.round === 1 && !state.alliance && state.currentPart === 2 ? renderAllianceSelection() : renderInvestmentOptions()}
                </div>
            `;
        }

        function renderChaebollGame() {
            return `
                <div class="game-container fade-in">
                    <div class="card game-card">
                        <div class="game-header">
                            <div class="game-header-left">
                                <h2>
                                    🏢 Chủ tịch Samsung - Vòng ${state.round}/${state.maxRounds}
                                </h2>
                                <p>Đế chế Chaebol</p>
                            </div>
                            <div class="game-budget">
                                💰 Ngân sách: <span id="budget">${state.budget}</span> điểm
                            </div>
                        </div>

                        <div class="stats-grid cols-4">
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>💰 Lợi nhuận</span>
                                    <span>${state.chaebollStats.profit.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.chaebollStats.profit}%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>⭐ Uy tín</span>
                                    <span>${state.chaebollStats.reputation.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.chaebollStats.reputation}%; background: linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>🏛️ Chính phủ</span>
                                    <span>${state.chaebollStats.government.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.chaebollStats.government}%; background: linear-gradient(90deg, #f59e0b, #fbbf24);"></div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">
                                    <span>📊 Thị trường</span>
                                    <span>${state.chaebollStats.market.toFixed(1)}%</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${state.chaebollStats.market}%; background: linear-gradient(90deg, #8b5cf6, #a78bfa);"></div>
                                </div>
                            </div>
                        </div>

                        ${state.news.length > 0 ? `
                            <div class="news-ticker">
                                <strong>📰 Tin tức:</strong> ${state.news[state.news.length - 1]}
                            </div>
                        ` : ''}

                        ${state.events.length > 0 ? `
                            <div class="info-box red">
                                <strong>⚠️ Sự kiện khẩn cấp:</strong> 
                                <span>${state.events[state.events.length - 1]}</span>
                            </div>
                        ` : ''}
                    </div>

                    ${renderChaebollOptions()}
                </div>
            `;
        }

        function renderAllianceSelection() {
            return `
                <div class="card section-card">
                    <h3 class="section-title-large">
                        🌏 Chọn định hướng quốc tế cho Hàn Quốc
                    </h3>
                    
                    <div class="alliance-box">
                        <h4>⚡ Bước ngoặt lịch sử!</h4>
                        <p>
                            ${storyEvents.international_pressure.description}
                        </p>
                        <div class="alliance-context">
                            <p>
                                💡 <strong>Lý thuyết:</strong> ${storyEvents.international_pressure.context}
                            </p>
                        </div>
                    </div>
                    
                    <div class="alliance-grid">
                        ${allianceOptions.map(option => `
                            <div class="investment-card card investment-card-wrapper" 
                                 onclick="selectAlliance('${option.id}')"
                                 style="background: ${option.color}20;">
                                <div class="investment-icon">${option.icon}</div>
                                <h4 class="investment-name">${option.name}</h4>
                                <p class="investment-description">${option.description}</p>
                                <div style="font-size: 0.75rem; font-weight: bold; color: #dc2626; margin-bottom: 8px;">
                                    ⚠️ Hậu quả: ${option.consequences}
                                </div>
                                <div style="font-size: 0.75rem; font-weight: 600; color: #059669;">
                                    📚 Bài học: ${option.lesson}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function renderInvestmentOptions() {
            const costPerInvestment = state.currentPart === 3 ? 10 : 25;
            
            return `
                <div class="card section-card">
                    <h3 class="section-title">
                        💡 Chọn hạng mục đầu tư (${costPerInvestment} điểm mỗi lần)
                    </h3>
                    
                    <div class="investment-grid cols-4">
                        ${investmentOptions.map(option => `
                            <div class="investment-card card investment-card-wrapper" 
                                 onclick="selectInvestment('${option.id}')"
                                 style="background: ${option.color}20;">
                                <div class="investment-icon">${option.icon}</div>
                                <h4 class="investment-name">${option.name}</h4>
                                <p class="investment-description">${option.description}</p>
                                <div class="investment-stats">
                                    Đã đầu tư: ${state.investments[option.id]} điểm
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="text-center mt-8">
                        <button onclick="nextRound()" 
                                class="btn-primary"
                                ${state.budget > 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            ${state.round < 5 ? '➡️ Vòng tiếp theo' : '🏁 Xem kết quả'}
                        </button>
                    </div>
                </div>
            `;
        }

        function renderChaebollOptions() {
            return `
                <div class="card section-card">
                    <h3 class="section-title">
                        🏢 Chiến lược Chaebol (25 điểm mỗi lần)
                    </h3>
                    
                    <div class="investment-grid cols-4">
                        ${chaebollOptions.map(option => `
                            <div class="investment-card card investment-card-wrapper" 
                                 onclick="selectChaebollStrategy('${option.id}')"
                                 style="background: ${option.color}20;">
                                <div class="investment-icon">${option.icon}</div>
                                <h4 class="investment-name">${option.name}</h4>
                                <p class="investment-description">${option.description}</p>
                                <div class="investment-stats">
                                    Đã đầu tư: ${state.investments[option.id] || 0} điểm
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="text-center mt-8">
                        <button onclick="nextRound()" 
                                class="btn-primary"
                                ${state.budget > 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            ${state.round < 5 ? '➡️ Vòng tiếp theo' : '🏁 Xem kết quả'}
                        </button>
                    </div>
                </div>
            `;
        }

        function renderResult() {
            const totalInvestment = Object.values(state.investments).reduce((a, b) => a + b, 0);
            
            // Determine which stats to show based on current part
            let statsDisplay = '';
            if (state.currentPart === 3) {
                // Part 3: Chaebol stats
                statsDisplay = `
                    <div class="result-stats-grid cols-4">
                        <div class="result-stat-card bg-gradient-green">
                            <div class="result-stat-icon">💰</div>
                            <div class="result-stat-value">${state.chaebollStats.profit.toFixed(1)}%</div>
                            <div class="result-stat-label">Lợi nhuận</div>
                        </div>
                        <div class="result-stat-card bg-gradient-blue">
                            <div class="result-stat-icon">⭐</div>
                            <div class="result-stat-value">${state.chaebollStats.reputation.toFixed(1)}%</div>
                            <div class="result-stat-label">Uy tín</div>
                        </div>
                        <div class="result-stat-card bg-gradient-purple">
                            <div class="result-stat-icon">🏛️</div>
                            <div class="result-stat-value">${state.chaebollStats.government.toFixed(1)}%</div>
                            <div class="result-stat-label">Quan hệ Chính phủ</div>
                        </div>
                        <div class="result-stat-card bg-gradient-yellow">
                            <div class="result-stat-icon">📊</div>
                            <div class="result-stat-value">${state.chaebollStats.market.toFixed(1)}%</div>
                            <div class="result-stat-label">Thị trường</div>
                        </div>
                    </div>
                `;
            } else if (state.currentPart === 2) {
                // Part 2: Include international
                statsDisplay = `
                    <div class="result-stats-grid cols-4">
                        <div class="result-stat-card bg-gradient-green">
                            <div class="result-stat-icon">📈</div>
                            <div class="result-stat-value">${state.stats.gdp.toFixed(1)}%</div>
                            <div class="result-stat-label">Tăng trưởng GDP</div>
                        </div>
                        <div class="result-stat-card bg-gradient-blue">
                            <div class="result-stat-icon">⚖️</div>
                            <div class="result-stat-value">${state.stats.equality.toFixed(1)}%</div>
                            <div class="result-stat-label">Công bằng xã hội</div>
                        </div>
                        <div class="result-stat-card bg-gradient-yellow">
                            <div class="result-stat-icon">💬</div>
                            <div class="result-stat-value">${state.stats.trust.toFixed(1)}%</div>
                            <div class="result-stat-label">Niềm tin công chúng</div>
                        </div>
                        <div class="result-stat-card bg-gradient-purple">
                            <div class="result-stat-icon">🌍</div>
                            <div class="result-stat-value">${state.stats.international.toFixed(1)}%</div>
                            <div class="result-stat-label">Quốc tế</div>
                        </div>
                    </div>
                `;
            } else {
                // Part 1: Only 3 stats
                statsDisplay = `
                    <div class="result-stats-grid">
                        <div class="result-stat-card bg-gradient-green">
                            <div class="result-stat-icon">📈</div>
                            <div class="result-stat-value">${state.stats.gdp.toFixed(1)}%</div>
                            <div class="result-stat-label">Tăng trưởng GDP</div>
                        </div>
                        <div class="result-stat-card bg-gradient-blue">
                            <div class="result-stat-icon">⚖️</div>
                            <div class="result-stat-value">${state.stats.equality.toFixed(1)}%</div>
                            <div class="result-stat-label">Công bằng xã hội</div>
                        </div>
                        <div class="result-stat-card bg-gradient-yellow">
                            <div class="result-stat-icon">💬</div>
                            <div class="result-stat-value">${state.stats.trust.toFixed(1)}%</div>
                            <div class="result-stat-label">Niềm tin công chúng</div>
                        </div>
                    </div>
                `;
            }
            
            return `
                <div class="card result-container fade-in">
                    <h2 class="result-title">
                        📊 Kết quả Vòng ${state.round}
                    </h2>

                    ${statsDisplay}

                    <div class="bg-purple-light">
                        <h3>💰 Phân bổ ngân sách của bạn:</h3>
                        <div class="budget-list">
                            ${state.currentPart === 3 ? 
                                chaebollOptions.map(option => `
                                    <div class="budget-item">
                                        <span class="text-lg">${option.icon} ${option.name}</span>
                                        <span class="text-xl" style="color: ${option.color};">${state.investments[option.id] || 0} điểm</span>
                                    </div>
                                `).join('') :
                                investmentOptions.map(option => `
                                    <div class="budget-item">
                                        <span class="text-lg">${option.icon} ${option.name}</span>
                                        <span class="text-xl" style="color: ${option.color};">${state.investments[option.id]} điểm</span>
                                    </div>
                                `).join('')
                            }
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-lg font-semibold" style="color: #6b7280;">
                            ${state.round >= 5 ? 
                                '🏁 Hoàn thành Part! Tự động chuyển sau 5 giây...' : 
                                '⏰ Tự động chuyển vòng tiếp theo sau 5 giây...'
                            }
                        </div>
                    </div>
                </div>
            `;
        }

        function renderAnalysis() {
            return `
                <div class="card max-w-5xl mx-auto p-8 md:p-12 fade-in">
                    <h2 class="text-4xl md:text-5xl font-bold text-center mb-8" style="color: #667eea;">
                        🧠 Phân tích học thuật
                    </h2>

                    <div class="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-400 rounded-2xl p-8 mb-8">
                        <h3 class="text-2xl md:text-3xl font-bold mb-4" style="color: #7c3aed;">
                            💡 Học thuyết của Lênin
                        </h3>
                        <p class="text-lg md:text-xl leading-relaxed mb-4" style="color: #4b5563;">
                            <strong>"Khi tư bản độc quyền liên kết với Nhà nước để điều tiết khủng hoảng, 
                            đó là biểu hiện của chủ nghĩa tư bản độc quyền nhà nước."</strong>
                        </p>
                        <p class="text-lg leading-relaxed" style="color: #4b5563;">
                            Trong trò chơi này, bạn đã trải nghiệm cách Nhà nước và các tập đoàn lớn 
                            phối hợp để vượt qua khủng hoảng - đúng như mô hình Hàn Quốc thực tế!
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="bg-green-50 border-4 border-green-300 rounded-2xl p-6">
                            <h4 class="text-2xl font-bold mb-4 text-green-700">✅ Tác động tích cực</h4>
                            <ul class="space-y-3 text-lg">
                                <li>🚀 Phục hồi kinh tế nhanh chóng</li>
                                <li>💼 Tạo việc làm hàng loạt</li>
                                <li>📦 Tăng xuất khẩu, thu ngoại tệ</li>
                                <li>🏗️ Xây dựng cơ sở hạ tầng hiện đại</li>
                                <li>🔬 Đầu tư công nghệ tiên tiến</li>
                            </ul>
                        </div>
                        <div class="bg-red-50 border-4 border-red-300 rounded-2xl p-6">
                            <h4 class="text-2xl font-bold mb-4 text-red-700">⚠️ Nguy cơ tiềm ẩn</h4>
                            <ul class="space-y-3 text-lg">
                                <li>📊 Tăng bất bình đẳng thu nhập</li>
                                <li>🏢 Quyền lực tập trung vào tập đoàn</li>
                                <li>🔗 Nhà nước phụ thuộc tư bản</li>
                                <li>👥 Người lao động bị bóc lột</li>
                                <li>🌍 Môi trường bị ảnh hưởng</li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-6 mb-8">
                        <h4 class="text-2xl font-bold mb-4" style="color: #f59e0b;">🎓 Bài học rút ra</h4>
                        <p class="text-lg md:text-xl leading-relaxed" style="color: #4b5563;">
                            <strong>Không có lựa chọn hoàn hảo</strong> - chỉ có sự cân bằng giữa tăng trưởng kinh tế 
                            và công bằng xã hội. Mỗi quyết định đều có cái giá của nó. Người lãnh đạo giỏi là người 
                            biết cân nhắc và tối ưu hóa lợi ích cho toàn xã hội!
                        </p>
                    </div>

                    <div class="text-center">
                        <button onclick="showFinalResult()" class="btn-primary">
                            🏆 Xem đánh giá cuối cùng
                        </button>
                    </div>
                </div>
            `;
        }

        function showAcademicModal() {
            state.screen = 'academic';
            state.academicSlide = 1;
            render();
        }

        function nextAcademicSlide() {
            if (!state.academicSlide) state.academicSlide = 1;
            if (state.academicSlide < 7) {
                state.academicSlide++;
                render();
            }
        }

        function prevAcademicSlide() {
            if (!state.academicSlide) state.academicSlide = 1;
            if (state.academicSlide > 1) {
                state.academicSlide--;
                render();
            }
        }

        function renderAcademic() {
            const currentSlide = state.academicSlide || 1;
            
            if (currentSlide === 1) {
                return `
                    <div class="academic-container fade-in">
                        <div class="academic-header">
                            <button onclick="goBackToIntro()" class="academic-back-btn">
                                ← Về trò chơi
                            </button>
                            <h2 class="academic-main-title">
                                📚 Nội dung học thuật
                            </h2>
                            <div class="academic-page-number">1/7</div>
                        </div>
                        
                        <div class="academic-content-card">
                            <h1 class="academic-title">A. Cạnh tranh và độc quyền trong kinh tế tư bản</h1>
                            
                            <p class="academic-intro">
                                Theo Kinh tế chính trị Mác - Lênin, quá trình phát triển của chủ nghĩa tư bản (CNTB) đi qua hai giai đoạn lớn:
                            </p>
                            
                            <div class="academic-table-section">
                                <div class="academic-table-header">
                                    <span class="academic-table-icon">📊</span>
                                    <span>Bảng so sánh hai giai đoạn:</span>
                                </div>
                                <table class="academic-table">
                                    <thead>
                                        <tr>
                                            <th>Giai đoạn</th>
                                            <th>Đặc trưng</th>
                                            <th>Cơ chế hoạt động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="academic-stage-green">Cạnh tranh tự do (TK XVIII - XIX)</td>
                                            <td>Hàng ngàn doanh nghiệp nhỏ cạnh tranh; giá trị hàng hóa quyết định bởi quy luật giá trị và cung cầu</td>
                                            <td>Kích thích đổi mới kỹ thuật, nhưng dẫn đến tích tụ tư bản</td>
                                        </tr>
                                        <tr>
                                            <td class="academic-stage-red">Độc quyền tư bản (cuối TK XIX - XX)</td>
                                            <td>Một số tập đoàn lớn chi phối thị trường, kiểm soát sản xuất và giá cả</td>
                                            <td>Tư bản tập trung → hình thành các tổ chức độc quyền (tập đoàn, ủy thác, liên minh)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="academic-quote-box">
                                <div class="academic-quote-header">
                                    <span class="academic-quote-icon">💡</span>
                                    <strong>Trích dẫn quan trọng - Lênin (1916):</strong>
                                </div>
                                <p class="academic-quote-text">
                                    "Cạnh tranh tự do sinh ra tập trung sản xuất, và sự tập trung này, khi đạt tới một trình độ nhất định, sẽ dẫn đến độc quyền."
                                </p>
                                <p class="academic-quote-source">
                                    Từ tác phẩm "Chủ nghĩa đế quốc – giai đoạn tột cùng của CNTB"
                                </p>
                            </div>
                        </div>
                        
                        <div class="academic-footer">
                            <button onclick="prevAcademicSlide()" class="academic-nav-btn" ${currentSlide === 1 ? 'disabled' : ''}>
                                ← Slide trước
                            </button>
                            <div class="academic-dots">
                                ${Array.from({length: 7}, (_, i) => `
                                    <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                                `).join('')}
                            </div>
                            <button onclick="nextAcademicSlide()" class="academic-nav-btn">
                                Slide tiếp →
                            </button>
                        </div>
                    </div>
                `;
            }
            
            if (currentSlide === 2) {
                return `
                    <div class="academic-container fade-in">
                        <div class="academic-header">
                            <button onclick="goBackToIntro()" class="academic-back-btn">
                                ← Về trò chơi
                            </button>
                            <h2 class="academic-main-title">
                                📚 Nội dung học thuật
                            </h2>
                            <div class="academic-page-number">2/7</div>
                        </div>
                        
                        <div class="academic-content-card">
                            <h1 class="academic-title">B. 5 đặc điểm kinh tế cơ bản của chủ nghĩa tư bản độc quyền</h1>
                            
                            <p class="academic-intro">
                                Theo V.I. Lênin, chủ nghĩa tư bản độc quyền có 5 đặc điểm cơ bản:
                            </p>
                            
                            <div class="academic-features-list">
                                <div class="academic-feature-item feature-green">
                                    <div class="academic-feature-header">
                                        <span class="academic-feature-number feature-number-green">1</span>
                                        <h3 class="academic-feature-title">Tập trung sản xuất và hình thành tổ chức độc quyền</h3>
                                    </div>
                                    <p class="academic-feature-explanation">
                                        <strong>Giải thích:</strong> Một số tập đoàn chi phối ngành kinh tế trọng yếu
                                    </p>
                                    <p class="academic-feature-modern">
                                        <strong>Biểu hiện hiện đại:</strong> <span class="academic-modern-text">Samsung, Hyundai, LG kiểm soát phần lớn công nghiệp Hàn Quốc</span>
                                    </p>
                                </div>
                                
                                <div class="academic-feature-item feature-blue">
                                    <div class="academic-feature-header">
                                        <span class="academic-feature-number feature-number-blue">2</span>
                                        <h3 class="academic-feature-title">Tư bản tài chính và tầng lớp tư sản tài chính thống trị</h3>
                                    </div>
                                    <p class="academic-feature-explanation">
                                        <strong>Giải thích:</strong> Liên kết giữa ngân hàng - công nghiệp - đầu tư
                                    </p>
                                    <p class="academic-feature-modern">
                                        <strong>Biểu hiện hiện đại:</strong> <span class="academic-modern-text">Chaebol sở hữu cả ngân hàng và công ty con trong nhiều lĩnh vực</span>
                                    </p>
                                </div>
                                
                                <div class="academic-feature-item feature-orange">
                                    <div class="academic-feature-header">
                                        <span class="academic-feature-number feature-number-orange">3</span>
                                        <h3 class="academic-feature-title">Xuất khẩu tư bản thay vì hàng hóa</h3>
                                    </div>
                                    <p class="academic-feature-explanation">
                                        <strong>Giải thích:</strong> Tư bản lớn đầu tư ra nước ngoài tìm lợi nhuận
                                    </p>
                                    <p class="academic-feature-modern">
                                        <strong>Biểu hiện hiện đại:</strong> <span class="academic-modern-text">Samsung, Hyundai, SK đầu tư khắp châu Á, Mỹ</span>
                                    </p>
                                </div>
                                
                                <div class="academic-feature-item feature-red">
                                    <div class="academic-feature-header">
                                        <span class="academic-feature-number feature-number-red">4</span>
                                        <h3 class="academic-feature-title">Liên minh độc quyền quốc tế chia nhau thị trường</h3>
                                    </div>
                                    <p class="academic-feature-explanation">
                                        <strong>Giải thích:</strong> Các tập đoàn xuyên quốc gia liên kết toàn cầu
                                    </p>
                                    <p class="academic-feature-modern">
                                        <strong>Biểu hiện hiện đại:</strong> <span class="academic-modern-text">Thỏa thuận chip bán dẫn, công nghệ vi mạch</span>
                                    </p>
                                </div>
                                
                                <div class="academic-feature-item feature-purple">
                                    <div class="academic-feature-header">
                                        <span class="academic-feature-number feature-number-purple">5</span>
                                        <h3 class="academic-feature-title">Sự phân chia kinh tế và lãnh thổ thế giới giữa các cường quốc tư bản</h3>
                                    </div>
                                    <p class="academic-feature-explanation">
                                        <strong>Giải thích:</strong> Kinh tế - chính trị gắn chặt vào quan hệ quốc tế
                                    </p>
                                    <p class="academic-feature-modern">
                                        <strong>Biểu hiện hiện đại:</strong> <span class="academic-modern-text">Mỹ - Hàn - Nhật hợp tác trong chuỗi cung ứng bán dẫn</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="academic-footer">
                            <button onclick="prevAcademicSlide()" class="academic-nav-btn">
                                ← Slide trước
                            </button>
                            <div class="academic-dots">
                                ${Array.from({length: 7}, (_, i) => `
                                    <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                                `).join('')}
                            </div>
                            <button onclick="nextAcademicSlide()" class="academic-nav-btn">
                                Slide tiếp →
                            </button>
                        </div>
                    </div>
                `;
            }
            
            if (currentSlide === 3) {
                return `
                    <div class="academic-container fade-in">
                        <div class="academic-header">
                            <button onclick="goBackToIntro()" class="academic-back-btn">
                                ← Về trò chơi
                            </button>
                            <h2 class="academic-main-title">
                                📚 Nội dung học thuật
                            </h2>
                            <div class="academic-page-number">3/7</div>
                        </div>
                        
                        <div class="academic-content-card">
                            <h1 class="academic-title">C. Từ độc quyền tư nhân → độc quyền nhà nước</h1>
                            
                            <p class="academic-intro">
                                Khi khủng hoảng kinh tế lặp lại, nhà nước buộc phải can thiệp để cứu hệ thống tư bản.
                            </p>
                            
                            <div class="academic-definition-box">
                                <div class="academic-definition-header">
                                    <span class="academic-definition-icon">🏛️</span>
                                    <h3 class="academic-definition-title">Chủ nghĩa tư bản độc quyền nhà nước (CTBDQNN)</h3>
                                </div>
                                <p class="academic-definition-text">
                                    Giai đoạn phát triển cao của CNTB, khi nhà nước liên kết và phục vụ tư bản lớn nhằm duy trì sự ổn định của hệ thống.
                                </p>
                            </div>
                            
                            <div class="academic-analysis-section">
                                <div class="academic-analysis-header">
                                    <span class="academic-analysis-icon">📋</span>
                                    <h3 class="academic-analysis-title">Bảng phân tích CTBDQNN:</h3>
                                </div>
                                <div class="academic-analysis-content">
                                    <div class="academic-analysis-item">
                                        <strong class="analysis-label analysis-blue">Bản chất:</strong>
                                        <p class="analysis-text">Sự kết hợp giữa sức mạnh nhà nước (chính trị, luật pháp, ngân sách) và sức mạnh tư bản độc quyền (kinh tế, công nghệ, tài chính)</p>
                                    </div>
                                    
                                    <div class="academic-analysis-item">
                                        <strong class="analysis-label analysis-green">Mục tiêu:</strong>
                                        <p class="analysis-text">Ổn định kinh tế, chống khủng hoảng, duy trì trật tự tư bản</p>
                                    </div>
                                    
                                    <div class="academic-analysis-item">
                                        <strong class="analysis-label analysis-purple">Hình thức biểu hiện:</strong>
                                        <p class="analysis-text">Nhà nước đầu tư hoặc "giải cứu" tập đoàn lớn, ân xá lãnh đạo doanh nghiệp, ban hành chính sách ưu đãi thuế</p>
                                    </div>
                                    
                                    <div class="academic-analysis-item">
                                        <strong class="analysis-label analysis-red">Mâu thuẫn:</strong>
                                        <p class="analysis-text">Nhà nước nhân danh lợi ích chung, nhưng thực chất bảo vệ lợi ích của tư bản độc quyền</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="academic-quote-box academic-quote-green">
                                <div class="academic-quote-header">
                                    <span class="academic-quote-icon">⭐</span>
                                    <strong>Trích dẫn tiêu biểu - Lênin:</strong>
                                </div>
                                <p class="academic-quote-text">
                                    "Nhà nước tư sản, trong thời kỳ chủ nghĩa tư bản độc quyền, chỉ là bộ máy của bọn độc quyền tư bản để củng cố địa vị thống trị của chúng."
                                </p>
                            </div>
                        </div>
                        
                        <div class="academic-footer">
                            <button onclick="prevAcademicSlide()" class="academic-nav-btn">
                                ← Slide trước
                            </button>
                            <div class="academic-dots">
                                ${Array.from({length: 7}, (_, i) => `
                                    <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                                `).join('')}
                            </div>
                            <button onclick="nextAcademicSlide()" class="academic-nav-btn">
                                Slide tiếp →
                            </button>
                        </div>
                    </div>
                `;
            }
            
            if (currentSlide === 4) {
                return `
                    <div class="academic-container fade-in">
                        <div class="academic-header">
                            <button onclick="goBackToIntro()" class="academic-back-btn">
                                ← Về trò chơi
                            </button>
                            <h2 class="academic-main-title">
                                📚 Nội dung học thuật
                            </h2>
                            <div class="academic-page-number">4/7</div>
                        </div>
                        
                        <div class="academic-content-card">
                            <h1 class="academic-title">D. Thông tin chính trị – kinh tế Hàn Quốc (Case 2022)</h1>
                            
                            <div class="academic-crisis-box">
                                <h3 class="academic-section-title">Bối cảnh khủng hoảng - Tháng 8/2022</h3>
                                <div class="academic-crisis-content">
                                    <div class="crisis-item">
                                        <strong>Lãnh đạo chính trị:</strong>
                                        <p>Tổng thống: Yoon Suk Yeol (bảo thủ, Đảng Quyền lực Quốc dân)</p>
                                    </div>
                                    <div class="crisis-item">
                                        <strong>Tình hình kinh tế:</strong>
                                        <ul class="crisis-list">
                                            <li>Lạm phát cao nhất 13 năm (6%)</li>
                                            <li>Đồng won giảm mạnh so với USD</li>
                                            <li>Tăng trưởng dự báo chỉ còn 2,6%</li>
                                            <li>Chuỗi cung ứng chip và năng lượng bị gián đoạn do chiến tranh Nga - Ukraine</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="academic-amnesty-box">
                                <h3 class="academic-section-title">Quyết định ân xá - 12/8/2022</h3>
                                <p class="academic-amnesty-text">
                                    Tổng thống Hàn Quốc ra lệnh ân xá cho khoảng 1.700 phạm nhân, trong đó có:
                                </p>
                                <ul class="academic-amnesty-list">
                                    <li><strong>Lee Jae-yong (Jay Y. Lee)</strong> - Chủ tịch Tập đoàn Samsung (từng bị kết án tham nhũng và hối lộ năm 2017)</li>
                                    <li><strong>Shin Dong-bin</strong> - Chủ tịch Tập đoàn Lotte</li>
                                </ul>
                                <div class="academic-official-reason">
                                    <strong>Lý do chính thức:</strong>
                                    <p class="academic-quote-official">
                                        "Để vượt qua khủng hoảng kinh tế và ổn định thị trường, chúng ta cần sự đóng góp của các nhà lãnh đạo doanh nghiệp chủ chốt." - Yoon Suk Yeol
                                    </p>
                                </div>
                            </div>
                            
                            <div class="academic-chaebol-box">
                                <h3 class="academic-section-title">Vai trò của Chaebol (tập đoàn gia đình Hàn Quốc)</h3>
                                <table class="academic-chaebol-table">
                                    <thead>
                                        <tr>
                                            <th>Tập đoàn</th>
                                            <th>Tỷ trọng trong GDP</th>
                                            <th>Lĩnh vực chính</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Samsung</strong></td>
                                            <td>~20% GDP</td>
                                            <td>Điện tử, bán dẫn, tài chính</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Hyundai</strong></td>
                                            <td>~10%</td>
                                            <td>Ô tô, xây dựng</td>
                                        </tr>
                                        <tr>
                                            <td><strong>SK Group</strong></td>
                                            <td>~8%</td>
                                            <td>Năng lượng, viễn thông</td>
                                        </tr>
                                        <tr>
                                            <td><strong>LG Group</strong></td>
                                            <td>~7%</td>
                                            <td>Điện tử, hóa chất</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p class="academic-chaebol-summary">
                                    → Tổng cộng 4 tập đoàn chiếm hơn 50% GDP Hàn Quốc.
                                </p>
                            </div>
                        </div>
                        
                        <div class="academic-footer">
                            <button onclick="prevAcademicSlide()" class="academic-nav-btn">
                                ← Slide trước
                            </button>
                            <div class="academic-dots">
                                ${Array.from({length: 7}, (_, i) => `
                                    <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                                `).join('')}
                            </div>
                            <button onclick="nextAcademicSlide()" class="academic-nav-btn">
                                Slide tiếp →
                            </button>
                        </div>
                    </div>
                `;
            }
            
            if (currentSlide === 5) {
                return `
                    <div class="academic-container fade-in">
                        <div class="academic-header">
                            <button onclick="goBackToIntro()" class="academic-back-btn">
                                ← Về trò chơi
                            </button>
                            <h2 class="academic-main-title">
                                📚 Nội dung học thuật
                            </h2>
                            <div class="academic-page-number">5/7</div>
                        </div>
                        
                        <div class="academic-content-card">
                            <h1 class="academic-title">E. Phản ứng xã hội và hậu quả kinh tế</h1>
                            
                            <div class="academic-pro-con-grid">
                                <div class="academic-pro-box">
                                    <div class="academic-pro-header">
                                        <span class="academic-pro-icon">✔</span>
                                        <h3 class="academic-pro-title">Phe ủng hộ ân xá</h3>
                                    </div>
                                    <ul class="academic-pro-list">
                                        <li>Ân xá giúp phục hồi sản xuất nhanh chóng</li>
                                        <li>Duy trì vị thế xuất khẩu chip toàn cầu</li>
                                        <li>Tăng việc làm và thu hút đầu tư</li>
                                        <li>Cần thiết trong bối cảnh khủng hoảng</li>
                                        <li>Lãnh đạo giỏi là tài sản quốc gia</li>
                                    </ul>
                                </div>
                                
                                <div class="academic-con-box">
                                    <div class="academic-con-header">
                                        <span class="academic-con-icon">✖</span>
                                        <h3 class="academic-con-title">Phe phản đối ân xá</h3>
                                    </div>
                                    <ul class="academic-con-list">
                                        <li>"Sự tha thứ cho người giàu"</li>
                                        <li>Làm xói mòn niềm tin vào pháp quyền</li>
                                        <li>Tạo tiền lệ xấu cho tương lai</li>
                                        <li>Bất bình đẳng trước pháp luật</li>
                                        <li>Khuyến khích tham nhũng</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="academic-press-box">
                                <div class="academic-press-header">
                                    <span class="academic-press-icon">📰</span>
                                    <h3 class="academic-press-title">Nhận xét của báo chí</h3>
                                </div>
                                <p class="academic-press-source"><strong>Tờ Korea Herald:</strong></p>
                                <p class="academic-press-quote">
                                    "Ân xá có thể giúp kinh tế ngắn hạn, nhưng làm suy yếu nguyên tắc bình đẳng trước pháp luật."
                                </p>
                            </div>
                            
                            <div class="academic-action-box">
                                <div class="academic-action-header">
                                    <span class="academic-action-icon">💰</span>
                                    <h3 class="academic-action-title">Hành động sau ân xá</h3>
                                </div>
                                <div class="academic-action-content">
                                    <div class="action-item">
                                        <strong>Cam kết đầu tư:</strong>
                                        <p>Lee Jae-yong công bố đầu tư 350 tỷ USD trong 5 năm (2022-2027) vào chip, sinh học và AI</p>
                                    </div>
                                    <div class="action-item">
                                        <strong>Phản ứng thị trường:</strong>
                                        <p>Cổ phiếu Samsung tăng 2,3% ngay sau thông báo</p>
                                    </div>
                                    <div class="action-item">
                                        <strong>Vấn đề còn tồn tại:</strong>
                                        <p>Hàn Quốc vẫn đối mặt với khủng hoảng nợ hộ gia đình và chênh lệch thu nhập</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="academic-lesson-box">
                                <div class="academic-lesson-header">
                                    <span class="academic-lesson-icon">🎓</span>
                                    <h3 class="academic-lesson-title">Bài học về CTBDQNN</h3>
                                </div>
                                <p class="academic-lesson-text">
                                    Case study Hàn Quốc 2022 là minh chứng điển hình cho "chủ nghĩa tư bản độc quyền nhà nước": Khi khủng hoảng xảy ra, nhà nước buộc phải "giải cứu" và dựa vào tư bản độc quyền để duy trì ổn định kinh tế, ngay cả khi điều này mâu thuẫn với nguyên tắc pháp quyền và công bằng xã hội.
                                </p>
                            </div>
                        </div>
                        
                        <div class="academic-footer">
                            <button onclick="prevAcademicSlide()" class="academic-nav-btn">
                                ← Slide trước
                            </button>
                            <div class="academic-dots">
                                ${Array.from({length: 7}, (_, i) => `
                                    <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                                `).join('')}
                            </div>
                            <button onclick="nextAcademicSlide()" class="academic-nav-btn">
                                Slide tiếp →
                            </button>
                        </div>
                    </div>
                `;
            }
            
            if (currentSlide === 6) {
                return `
                    <div class="academic-container fade-in">
                        <div class="academic-header">
                            <button onclick="goBackToIntro()" class="academic-back-btn">
                                ← Về trò chơi
                            </button>
                            <h2 class="academic-main-title">
                                📚 Nội dung học thuật
                            </h2>
                            <div class="academic-page-number">6/7</div>
                        </div>
                        
                        <div class="academic-content-card">
                            <h1 class="academic-title">F. Phân tích liên hệ giữa lý luận và thực tiễn</h1>
                            
                            <div class="academic-comparison-section">
                                <div class="academic-comparison-header">
                                    <span class="academic-comparison-icon">✨</span>
                                    <h3 class="academic-comparison-title">Bảng phân tích so sánh</h3>
                                </div>
                                <table class="academic-comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Theo Lênin</th>
                                            <th>Biểu hiện tại Hàn Quốc 2022</th>
                                            <th>Giải thích</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Tập trung sản xuất – độc quyền</td>
                                            <td>4 chaebol chi phối 50% GDP</td>
                                            <td>Kinh tế bị tập trung cao độ</td>
                                        </tr>
                                        <tr>
                                            <td>Tư bản tài chính thống trị</td>
                                            <td>Chaebol có ngân hàng, quỹ riêng</td>
                                            <td>Gắn kết vốn – quyền lực chính trị</td>
                                        </tr>
                                        <tr>
                                            <td>Nhà nước và tư bản kết hợp</td>
                                            <td>Ân xá, ưu đãi đầu tư, "deal ngầm"</td>
                                            <td>Nhà nước hành động vì tư bản lớn</td>
                                        </tr>
                                        <tr>
                                            <td>CTBDQNN hình thành</td>
                                            <td>Chính phủ + Chaebol cùng điều tiết thị trường</td>
                                            <td>Mô hình "chủ nghĩa tư bản nhà nước kiểu mới"</td>
                                        </tr>
                                        <tr>
                                            <td>Mâu thuẫn giai cấp mới</td>
                                            <td>Dân lao động – tầng lớp tài phiệt</td>
                                            <td>Mâu thuẫn chuyển từ sản xuất sang công bằng pháp lý</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="academic-theory-conclusion-box">
                                <div class="academic-theory-header">
                                    <span class="academic-theory-icon">❤️</span>
                                    <h3 class="academic-theory-title">Kết luận lý luận</h3>
                                </div>
                                <p class="academic-theory-text">
                                    Hàn Quốc 2022 phản ánh bản chất hai mặt của CNTB độc quyền nhà nước – vừa giúp quốc gia chống khủng hoảng, vừa làm sâu sắc thêm sự lệ thuộc vào tư bản độc quyền.
                                </p>
                            </div>
                            
                            <div class="academic-detailed-analysis">
                                <div class="academic-detailed-header">
                                    <span class="academic-detailed-icon">🔍</span>
                                    <h3 class="academic-detailed-title">Phân tích chi tiết</h3>
                                </div>
                                <div class="academic-detailed-items">
                                    <div class="detailed-item">
                                        <strong>1. Tập trung sản xuất:</strong>
                                        <p>Samsung một mình chiếm 20% GDP, cho thấy mức độ tập trung kinh tế cực cao – đúng như dự báo của Lênin về xu hướng độc quyền hóa.</p>
                                    </div>
                                    <div class="detailed-item">
                                        <strong>2. Liên kết tài chính - chính trị:</strong>
                                        <p>Chaebol không chỉ kiểm soát sản xuất mà còn có ngân hàng, quỹ đầu tư, và ảnh hưởng trực tiếp đến chính sách nhà nước.</p>
                                    </div>
                                    <div class="detailed-item">
                                        <strong>3. Nhà nước phục vụ tư bản:</strong>
                                        <p>Quyết định ân xá cho thấy nhà nước đặt lợi ích kinh tế (của tư bản lớn) lên trên nguyên tắc pháp quyền.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="academic-contradiction-box">
                                <div class="academic-contradiction-header">
                                    <span class="academic-contradiction-icon">📊</span>
                                    <h3 class="academic-contradiction-title">Mâu thuẫn cơ bản</h3>
                                </div>
                                <p class="academic-contradiction-text">
                                    Case study này cho thấy mâu thuẫn cốt lõi của CTBDQNN: Nhà nước phải đảm bảo lợi ích chung của toàn xã hội, nhưng lại buộc phải ưu tiên cho tư bản độc quyền để duy trì ổn định kinh tế.
                                </p>
                                <div class="academic-contradiction-quote">
                                    <p class="academic-contradiction-quote-text">
                                        "Đây chính là biểu hiện của mâu thuẫn giữa tính chất xã hội của sản xuất và tính chất tư nhân của chiếm hữu trong điều kiện tư bản độc quyền." - Phân tích theo quan điểm Mác-Lênin
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="academic-footer">
                            <button onclick="prevAcademicSlide()" class="academic-nav-btn">
                                ← Slide trước
                            </button>
                            <div class="academic-dots">
                                ${Array.from({length: 7}, (_, i) => `
                                    <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                                `).join('')}
                            </div>
                            <button onclick="nextAcademicSlide()" class="academic-nav-btn">
                                Slide tiếp →
                            </button>
                        </div>
                    </div>
                `;
            }
            
            if (currentSlide === 7) {
                return `
                    <div class="academic-container fade-in">
                        <div class="academic-header">
                            <button onclick="goBackToIntro()" class="academic-back-btn">
                                ← Về trò chơi
                            </button>
                            <h2 class="academic-main-title">
                                📚 Nội dung học thuật
                            </h2>
                            <div class="academic-page-number">7/7</div>
                        </div>
                        
                        <div class="academic-content-card">
                            <h1 class="academic-title">G. Đánh giá - Nhận xét học thuật</h1>
                            
                            <div class="academic-evaluation-table-section">
                                <h3 class="academic-evaluation-title">Bảng đánh giá đa chiều</h3>
                                <table class="academic-evaluation-table">
                                    <thead>
                                        <tr>
                                            <th>Khía cạnh</th>
                                            <th>Tích cực</th>
                                            <th>Tiêu cực</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Kinh tế</strong></td>
                                            <td>Giữ ổn định tăng trưởng, duy trì chuỗi cung ứng, bảo vệ việc làm</td>
                                            <td>Tạo tiền lệ xấu – "cứu tư bản lớn, bỏ mặc công lý"</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Chính trị</strong></td>
                                            <td>Củng cố năng lực quản trị trong khủng hoảng</td>
                                            <td>Làm mờ ranh giới giữa công - tư, dễ dẫn đến tham nhũng chính trị</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Xã hội</strong></td>
                                            <td>Niềm tin vào tăng trưởng ngắn hạn</td>
                                            <td>Gia tăng bất bình đẳng, giảm niềm tin vào pháp quyền</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Triết học - học thuật</strong></td>
                                            <td>Thể hiện rõ mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất</td>
                                            <td>Minh chứng cho dự báo của Lênin về CTBDQNN</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="academic-marxist-box">
                                <div class="academic-marxist-header">
                                    <span class="academic-marxist-icon">☀️</span>
                                    <h3 class="academic-marxist-title">Từ góc nhìn Mác - Lênin</h3>
                                </div>
                                <p class="academic-marxist-text">
                                    Nhà nước không còn chỉ là "trọng tài trung lập", mà trở thành "người quản lý lợi ích chung của tư bản độc quyền" - một dạng quyền lực lai giữa kinh tế và chính trị.
                                </p>
                            </div>
                            
                            <div class="academic-notes-grid">
                                <div class="academic-notes-positive">
                                    <div class="academic-notes-header">
                                        <span class="academic-notes-icon">✔</span>
                                        <h3 class="academic-notes-title">Những điểm đáng chú ý</h3>
                                    </div>
                                    <ul class="academic-notes-list">
                                        <li>Hiệu quả ngắn hạn: Ân xá giúp Samsung cam kết đầu tư 350 tỷ USD</li>
                                        <li>Ổn định thị trường: Cổ phiếu tăng, niềm tin nhà đầu tư phục hồi</li>
                                        <li>Duy trì chuỗi cung ứng: Ngành chip toàn cầu không bị gián đoạn</li>
                                        <li>Bảo vệ việc làm: Hàng triệu công nhân Samsung được đảm bảo</li>
                                    </ul>
                                </div>
                                
                                <div class="academic-notes-negative">
                                    <div class="academic-notes-header">
                                        <span class="academic-notes-icon-negative">✖</span>
                                        <h3 class="academic-notes-title">Những hệ lụy lâu dài</h3>
                                    </div>
                                    <ul class="academic-notes-list">
                                        <li>Đạo đức xã hội: "Luật pháp khác nhau cho người giàu và nghèo"</li>
                                        <li>Tiền lệ nguy hiểm: Khuyến khích hành vi rủi ro của tư bản lớn</li>
                                        <li>Bất bình đẳng: Khoảng cách giàu nghèo tiếp tục gia tăng</li>
                                        <li>Phụ thuộc: Nhà nước ngày càng lệ thuộc vào chaebol</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="academic-final-conclusion">
                                <div class="academic-final-header">
                                    <span class="academic-final-icon">🎓</span>
                                    <h3 class="academic-final-title">Kết luận học thuật</h3>
                                </div>
                                <p class="academic-final-intro">
                                    Case study Hàn Quốc 2022 là minh chứng sống động cho lý thuyết Lênin về chủ nghĩa tư bản độc quyền nhà nước. Nó cho thấy:
                                </p>
                                <ul class="academic-final-list">
                                    <li><strong>Tính tất yếu:</strong> Trong khủng hoảng, nhà nước buộc phải can thiệp để cứu hệ thống</li>
                                    <li><strong>Tính mâu thuẫn:</strong> Lợi ích tư bản độc quyền vs lợi ích xã hội</li>
                                    <li><strong>Tính lịch sử:</strong> Đây là giai đoạn phát triển tất yếu của CNTB</li>
                                    <li><strong>Tính toàn cầu:</strong> Hiện tượng này không chỉ riêng Hàn Quốc</li>
                                </ul>
                                <div class="academic-final-quote">
                                    <p class="academic-final-quote-text">
                                        "Chủ nghĩa tư bản độc quyền nhà nước không phải là giải pháp cho mâu thuẫn của CNTB, mà chỉ là cách thức để duy trì và kéo dài sự tồn tại của nó." - Nhận định theo quan điểm Mác-Lênin
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="academic-footer">
                            <button onclick="prevAcademicSlide()" class="academic-nav-btn">
                                ← Slide trước
                            </button>
                            <div class="academic-dots">
                                ${Array.from({length: 7}, (_, i) => `
                                    <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                                `).join('')}
                            </div>
                            <button onclick="nextAcademicSlide()" class="academic-nav-btn" disabled>
                                Slide tiếp →
                            </button>
                        </div>
                    </div>
                `;
            }
            
            return `
                <div class="academic-container fade-in">
                    <div class="academic-header">
                        <button onclick="goBackToIntro()" class="academic-back-btn">
                            ← Về trò chơi
                        </button>
                        <h2 class="academic-main-title">
                            📚 Nội dung học thuật
                        </h2>
                        <div class="academic-page-number">${currentSlide}/7</div>
                    </div>
                    
                    <div class="academic-content-card">
                        <h1 class="academic-title">Slide ${currentSlide}</h1>
                        <p class="academic-intro">Nội dung slide ${currentSlide} sẽ được thêm sau...</p>
                    </div>
                    
                    <div class="academic-footer">
                        <button onclick="prevAcademicSlide()" class="academic-nav-btn" ${currentSlide === 1 ? 'disabled' : ''}>
                            ← Slide trước
                        </button>
                        <div class="academic-dots">
                            ${Array.from({length: 7}, (_, i) => `
                                <span class="academic-dot ${i + 1 === currentSlide ? 'active' : ''}"></span>
                            `).join('')}
                        </div>
                        <button onclick="nextAcademicSlide()" class="academic-nav-btn" ${currentSlide === 7 ? 'disabled' : ''}>
                            Slide tiếp →
                        </button>
                    </div>
                </div>
            `;
        }

        function goBackToIntro() {
            state.screen = 'intro';
            render();
        }

        function renderFinal() {
            const result = calculateFinalResult();
            
            return `
                <div class="card max-w-4xl mx-auto p-8 md:p-12 text-center fade-in">
                    <div class="text-8xl mb-6 bounce">${result.icon}</div>
                    <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: #667eea;">
                        Kết quả cuối cùng
                    </h2>
                    
                    <div class="mb-8">
                        <span class="result-badge ${result.class}">${result.title}</span>
                    </div>

                    <p class="text-xl md:text-2xl leading-relaxed mb-8" style="color: #4b5563;">
                        ${result.description}
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="p-6 rounded-2xl" style="background: linear-gradient(135deg, #d1fae5, #a7f3d0);">
                            <div class="text-4xl mb-2">📈</div>
                            <div class="text-3xl font-bold">${state.stats.gdp.toFixed(1)}%</div>
                            <div class="text-lg">GDP</div>
                        </div>
                        <div class="p-6 rounded-2xl" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe);">
                            <div class="text-4xl mb-2">⚖️</div>
                            <div class="text-3xl font-bold">${state.stats.equality.toFixed(1)}%</div>
                            <div class="text-lg">Công bằng</div>
                        </div>
                        <div class="p-6 rounded-2xl" style="background: linear-gradient(135deg, #fef3c7, #fde68a);">
                            <div class="text-4xl mb-2">💬</div>
                            <div class="text-3xl font-bold">${state.stats.trust.toFixed(1)}%</div>
                            <div class="text-lg">Niềm tin</div>
                        </div>
                        <div class="p-6 rounded-2xl" style="background: linear-gradient(135deg, #e9d5ff, #c4b5fd);">
                            <div class="text-4xl mb-2">🌍</div>
                            <div class="text-3xl font-bold">${state.stats.international.toFixed(1)}%</div>
                            <div class="text-lg">Quốc tế</div>
                        </div>
                    </div>

                    <div class="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6 mb-8">
                        <p class="text-xl font-bold" style="color: #2563eb;">
                            ${result.lesson}
                        </p>
                    </div>

                    <button onclick="resetGame()" class="btn-primary">
                        🔄 Chơi lại
                    </button>
                </div>
            `;
        }

        function startGame() {
            state.screen = 'game';
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function selectInvestment(id) {
            const costPerInvestment = state.currentPart === 3 ? 10 : 25;
            
            if (state.budget < costPerInvestment) {
                showBudgetWarning(costPerInvestment);
                return;
            }

            const option = investmentOptions.find(opt => opt.id === id);
            
            state.budget -= costPerInvestment;
            state.investments[id] += costPerInvestment;
            state.totalInvested[id] += costPerInvestment;
            
            // Tính hiệu ứng với diminishing returns và synergy
            const effects = calculateEffects(option, id);
            
            state.stats.gdp = Math.max(0, Math.min(100, state.stats.gdp + effects.gdp));
            state.stats.equality = Math.max(0, Math.min(100, state.stats.equality + effects.equality));
            state.stats.trust = Math.max(0, Math.min(100, state.stats.trust + effects.trust));
            state.stats.international = Math.max(0, Math.min(100, state.stats.international + effects.international));
            
            // Check Game Over
            if (checkGameOver()) {
                return;
            }
            
            state.news.push(option.news);
            
            // Hiển thị viễn cảnh kết quả
            showInvestmentVision(option, effects);
            
            // Random event có 25% khả năng xảy ra (giảm từ 30%)
            if (Math.random() < 0.25 && state.events.length < Math.floor(state.round / 2)) {
                triggerRandomEvent();
            }
            
            playSound('invest');
            createConfetti();
            
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function selectChaebollStrategy(id) {
            if (state.budget < 25) {
                showBudgetWarning(25);
                return;
            }

            const option = chaebollOptions.find(opt => opt.id === id);
            
            state.budget -= 25;
            if (!state.investments[id]) state.investments[id] = 0;
            if (!state.totalInvested[id]) state.totalInvested[id] = 0;
            state.investments[id] += 25;
            state.totalInvested[id] += 25;
            
            // Tính hiệu ứng cho Chaebol với diminishing returns mạnh hơn
            const effects = calculateChaebollEffects(option, id);
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + effects.market));
            
            // Check Game Over
            if (checkGameOver()) {
                return;
            }
            
            state.news.push(option.news);
            
            // Hiển thị viễn cảnh kết quả cho Chaebol
            showChaebollVision(option, effects);
            
            // Random event có 35% khả năng xảy ra (cao hơn vì Part 3 khó hơn)
            if (Math.random() < 0.35) {
                triggerChaebollEvent();
            }
            
            playSound('invest');
            createConfetti();
            
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function selectAlliance(id) {
            const alliance = allianceOptions.find(opt => opt.id === id);
            
            state.alliance = id;
            state.storyContext.currentEvent = 'international_pressure';
            
            // Áp dụng hiệu ứng liên minh
            state.stats.gdp = Math.max(0, Math.min(100, state.stats.gdp + alliance.effects.gdp));
            state.stats.equality = Math.max(0, Math.min(100, state.stats.equality + alliance.effects.equality));
            state.stats.trust = Math.max(0, Math.min(100, state.stats.trust + alliance.effects.trust));
            state.stats.international = Math.max(0, Math.min(100, state.stats.international + alliance.effects.international));
            
            state.news.push(`🌏 Hàn Quốc chính thức gia nhập ${alliance.name}! ${alliance.consequences}`);
            
            playSound('invest');
            createConfetti();
            
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function calculateEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Áp dụng penalty trực tiếp cho mỗi lần đầu tư
            if (option.directPenalties) {
                for (const [stat, penalty] of Object.entries(option.directPenalties)) {
                    effects[stat] += penalty;
                }
            }
            
            // Diminishing returns - hiệu quả giảm khi đầu tư quá nhiều vào 1 lĩnh vực
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.gdp *= diminishingFactor;
            effects.equality *= diminishingFactor;
            effects.trust *= diminishingFactor;
            effects.international *= diminishingFactor;
            
            // Cross-effects - đầu tư vào 1 lĩnh vực ảnh hưởng đến lĩnh vực khác
            // Nhà nước vs Tư bản (cạnh tranh trực tiếp)
            if (id === 'state' && state.totalInvested.chaebols > 0) {
                const chaebollLevel = state.totalInvested.chaebols / 25;
                effects.gdp -= chaebollLevel * 1.5; // Cạnh tranh làm giảm hiệu quả
            }
            if (id === 'chaebols' && state.totalInvested.state > 0) {
                const stateLevel = state.totalInvested.state / 25;
                effects.equality -= stateLevel * 1.2; // Tư bản làm tăng bất bình đẳng (giảm 40%: từ 2.0 xuống 1.2)
            }
            
            // Tư bản vs Phúc lợi (mâu thuẫn lợi nhuận vs phúc lợi)
            if (id === 'chaebols' && state.totalInvested.welfare > 0) {
                const welfareLevel = state.totalInvested.welfare / 25;
                effects.trust -= welfareLevel * 1.0; // Mâu thuẫn xã hội
            }
            if (id === 'welfare' && state.totalInvested.chaebols > 0) {
                const chaebollLevel = state.totalInvested.chaebols / 25;
                effects.gdp -= chaebollLevel * 1.5; // Phúc lợi làm giảm đầu tư tư nhân
            }
            
            // Phúc lợi vs Công nghệ (cạnh tranh ngân sách)
            if (id === 'welfare' && state.totalInvested.tech > 0) {
                const techLevel = state.totalInvested.tech / 25;
                effects.international -= techLevel * 1.0; // Ít tiền cho R&D quốc tế
            }
            if (id === 'tech' && state.totalInvested.welfare > 0) {
                const welfareLevel = state.totalInvested.welfare / 25;
                effects.equality -= welfareLevel * 0.6; // Công nghệ tăng khoảng cách (giảm 40%: từ 1.0 xuống 0.6)
            }
            
            // Synergy effects - kết hợp các lĩnh vực tạo bonus
            if (state.totalInvested.state > 0 && state.totalInvested.tech > 0) {
                effects.gdp += 1.5; // Nhà nước + Công nghệ = hiệu quả cao
                effects.trust += 1.5;
                effects.international += 1.0;
            }
            
            if (state.totalInvested.chaebols > 0 && state.totalInvested.tech > 0) {
                effects.gdp += 2.5; // Tư bản + Công nghệ = tăng trưởng mạnh
                effects.equality -= 0.9; // Nhưng tăng bất bình đẳng (giảm 40%: từ 1.5 xuống 0.9)
                effects.international += 2.0;
            }
            
            if (state.totalInvested.welfare > 0 && state.totalInvested.state > 0) {
                effects.equality += 2.0; // Phúc lợi + Nhà nước = công bằng hơn
                effects.trust += 1.5;
            }
            
            // Đảm bảo điểm cộng công bằng tối thiểu 11 khi chọn Trợ cấp Dân sinh
            if (id === 'welfare' && effects.equality < 11.0) {
                effects.equality = 11.0;
            }
            
            // Alliance bonus effects (áp dụng từ khi đã chọn alliance)
            if (state.alliance && state.currentPart === 2) {
                const alliance = allianceOptions.find(a => a.id === state.alliance);
                if (alliance) {
                    // Bonus nhỏ cho mỗi lần đầu tư khi có liên minh
                    effects.gdp += alliance.effects.gdp * 0.1;
                    effects.equality += alliance.effects.equality * 0.1;
                    effects.trust += alliance.effects.trust * 0.1;
                    effects.international += alliance.effects.international * 0.1;
                    
                    // Đảm bảo equality vẫn tối thiểu 11 sau alliance bonus
                    if (id === 'welfare' && effects.equality < 11.0) {
                        effects.equality = 11.0;
                    }
                }
            }
            
            return effects;
        }

        function triggerRandomEvent() {
            const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            
            state.stats.gdp = Math.max(0, Math.min(100, state.stats.gdp + event.effects.gdp));
            state.stats.equality = Math.max(0, Math.min(100, state.stats.equality + event.effects.equality));
            state.stats.trust = Math.max(0, Math.min(100, state.stats.trust + event.effects.trust));
            
            // Check Game Over sau random event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        function nextRound() {
            if (state.budget > 0) {
                showMessage('Vui lòng sử dụng hết ngân sách!', 'error');
                return;
            }

            state.screen = 'result';
            
            setTimeout(() => {
                if (state.round < 5) { // Mỗi Part chỉ có 5 vòng
                    // Chuyển vòng tiếp theo
                    state.round++;
                    state.budget = 100;
                    state.screen = 'game';
                } else {
                    // Kết thúc Part hiện tại
                    showFinalResult();
                }
                render();
            }, 5000); // 5 giây
            
            render();
        }

        function continueToAnalysis() {
            state.screen = 'analysis';
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function showFinalResult() {
            if (state.currentPart === 1) {
                // Lưu kết quả Part 1
                state.partResults.part1 = calculateFinalResult();
                
                // Chuyển sang Part 2 (Quốc tế)
                state.currentPart = 2;
                state.round = 1; // Reset về vòng 1 cho Part 2
                state.maxRounds = 5;
                state.budget = 100;
                state.investments = { state: 0, chaebols: 0, welfare: 0, tech: 0 };
                // Reset stats về 35% cho Part 2
                state.stats = { gdp: 35.0, equality: 35.0, trust: 35.0, international: 50.0 };
                state.news = [];
                state.events = [];
                state.alliance = null;
                state.phase = 2;
                state.storyContext.currentEvent = 'international_pressure';
                
                state.screen = 'part2_intro';
                function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
            } else if (state.currentPart === 2) {
                // Lưu kết quả Part 2
                state.partResults.part2 = calculateFinalResult();
                
                // Chuyển sang Part 3 (Chaebol)
                state.currentPart = 3;
                state.round = 1;
                state.maxRounds = 5; // Chỉ 5 vòng cho Part 3
                state.budget = 100; // 100 điểm/vòng giống Part 1 & 2
                state.investments = { lobby: 0, innovation: 0, expansion: 0, social: 0 };
                state.totalInvested = { lobby: 0, innovation: 0, expansion: 0, social: 0 };
                state.news = [];
                state.events = [];
                
                // Reset stats cho Part 3 với chỉ số Chaebol
                state.chaebollStats = {
                    profit: 35.0,
                    reputation: 35.0,
                    government: 35.0,
                    market: 35.0
                };
                
                state.screen = 'part3_intro';
                function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
            } else {
                // Part 3 kết thúc - lưu kết quả và hiển thị tổng kết
                state.partResults.part3 = calculateChaebollResult();
                state.screen = 'final_summary';
                createConfetti();
                function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
            }
        }

        function calculateFinalResult() {
            const { gdp, equality, trust, international } = state.stats;
            
            // Part 1 chỉ có 3 stats, Part 2 có 4 stats
            let avg, perfectScore, goodScore;
            const targetScore = state.currentPart === 1 ? 80 : 85; // Part 1: 80+, Part 2: 85+
            
            if (state.currentPart === 1) {
                // Part 1: Chỉ tính 3 stats (không có international)
                avg = (gdp + equality + trust) / 3;
                perfectScore = gdp >= targetScore && equality >= targetScore && trust >= targetScore;
                goodScore = gdp >= (targetScore - 10) && equality >= (targetScore - 10) && trust >= (targetScore - 10);
            } else {
                // Part 2: Tính 4 stats (bao gồm international)
                avg = (gdp + equality + trust + international) / 4;
                perfectScore = gdp >= targetScore && equality >= targetScore && trust >= targetScore && international >= targetScore;
                goodScore = gdp >= (targetScore - 10) && equality >= (targetScore - 10) && trust >= (targetScore - 10) && international >= (targetScore - 10);
            }

            // Phân tích theo liên minh đã chọn
            const allianceAnalysis = state.alliance ? getAllianceAnalysis() : '';

            // Lưu stats theo từng part
            const result = {
                success: perfectScore
            };
            
            if (state.currentPart === 1) {
                result.stats = { gdp, equality, trust }; // Part 1 không có international
            } else {
                result.stats = { gdp, equality, trust, international }; // Part 2 có đầy đủ
            }

            if (perfectScore) {
                result.icon = '👑';
                result.title = state.currentPart === 1 ? 'Bậc Thầy Nội Chính' : 'Bậc Thầy Địa Chính Trị';
                result.class = 'badge-balanced';
                const statCount = state.currentPart === 1 ? '3 chỉ số' : '4 chỉ số';
                result.description = `XUẤT SẮC! Bạn đã đạt ${targetScore}+ điểm cho cả ${statCount}. ${allianceAnalysis}`;
                result.lesson = 'Đây là minh chứng cho khả năng lãnh đạo xuất sắc!';
            } else if (goodScore) {
                result.icon = '🏆';
                result.title = 'Nhà Lãnh Đạo Giỏi';
                result.class = 'badge-balanced';
                result.description = `Tốt! Bạn đã vượt qua thử thách với thành tích khá. ${allianceAnalysis}`;
                result.lesson = 'Cần cải thiện thêm để đạt mục tiêu hoàn hảo!';
            } else if (gdp >= 75 && equality <= 50) {
                result.icon = '💼';
                result.title = 'Nhà Tư Bản Độc Quyền';
                result.class = 'badge-reformer';
                result.description = `Tăng trưởng mạnh nhưng bất bình đẳng cao. ${allianceAnalysis}`;
                result.lesson = 'Biểu hiện của "chủ nghĩa tư bản độc quyền nhà nước"!';
            } else {
                result.icon = '🤔';
                result.title = 'Cần Cải Thiện';
                result.class = 'badge-idealist';
                result.description = `Chưa đạt mục tiêu ${targetScore}+ điểm. ${allianceAnalysis}`;
                result.lesson = 'Hãy thử lại với chiến lược khác!';
            }

            return result;
        }

        function calculateChaebollResult() {
            const { profit, reputation, government, market } = state.chaebollStats;
            const avg = (profit + reputation + government + market) / 4;
            const perfectScore = profit >= 85 && reputation >= 85 && government >= 85 && market >= 85;
            const goodScore = profit >= 75 && reputation >= 75 && government >= 75 && market >= 75;

            const result = {
                stats: { profit, reputation, government, market },
                success: perfectScore
            };

            if (perfectScore) {
                result.icon = '👑';
                result.title = 'Hoàng Đế Chaebol';
                result.class = 'badge-balanced';
                result.description = 'HOÀN HẢO! Bạn đã thống trị cả 4 lĩnh vực với 85+ điểm!';
                result.lesson = 'Đây là sức mạnh thực sự của tư bản độc quyền!';
            } else if (goodScore) {
                result.icon = '🏆';
                result.title = 'Chaebol Thành Công';
                result.class = 'badge-balanced';
                result.description = 'Tuyệt vời! Bạn đã xây dựng đế chế kinh doanh mạnh mẽ!';
                result.lesson = 'Gần đạt được sức mạnh tối đa của tập đoàn lớn!';
            } else if (profit >= 80 && government <= 50) {
                result.icon = '💰';
                result.title = 'Tư Bản Hoang Dã';
                result.class = 'badge-reformer';
                result.description = 'Lợi nhuận cao nhưng quan hệ chính trị yếu!';
                result.lesson = 'Không có sự hỗ trợ của nhà nước, chaebol khó bền vững!';
            } else if (government >= 80 && profit <= 50) {
                result.icon = '🤝';
                result.title = 'Chaebol Chính Trị';
                result.class = 'badge-idealist';
                result.description = 'Quan hệ tốt với chính phủ nhưng lợi nhuận thấp!';
                result.lesson = 'Cần cân bằng giữa chính trị và kinh doanh!';
            } else {
                result.icon = '📉';
                result.title = 'Chaebol Thất Bại';
                result.class = 'badge-reformer';
                result.description = 'Chưa đạt được sức mạnh của một tập đoàn lớn!';
                result.lesson = 'Trong thế giới khắc nghiệt này, chỉ có thành công hoặc thất bại!';
            }

            return result;
        }

        function getAllianceAnalysis() {
            if (!state.alliance) return 'Việc không chọn liên minh có thể đã ảnh hưởng đến vị thế quốc tế.';
            
            const alliance = allianceOptions.find(a => a.id === state.alliance);
            switch(state.alliance) {
                case 'usa':
                    return 'Liên minh với Mỹ đã mang lại công nghệ và thị trường, nhưng tạo căng thẳng với Trung Quốc.';
                case 'china':
                    return 'Hợp tác với Trung Quốc thúc đẩy tăng trưởng nhưng gây lo ngại về độc lập chính trị.';
                case 'eu':
                    return 'Quan hệ với EU mang lại sự cân bằng và bền vững trong phát triển.';
                case 'independent':
                    return 'Con đường tự chủ bảo vệ chủ quyền nhưng hạn chế cơ hội tăng trưởng.';
                default:
                    return '';
            }
        }

        function renderPart2Intro() {
            return `
                <div class="card part2-intro-container fade-in">
                    <div class="icon-large bounce">🌏</div>
                    <h1 class="part2-intro-title">
                        Part 2: Thời đại Địa chính trị
                    </h1>
                    
                    <div class="part2-success-box">
                        <h3>🎉 Chúc mừng hoàn thành Part 1!</h3>
                        <p>Kết quả Part 1: <strong>${state.partResults.part1?.title || 'Đang tính toán...'}</strong></p>
                        <p style="font-size: 1rem;">
                            Bây giờ bạn sẽ đối mặt với thách thức lớn hơn: <strong>Địa chính trị toàn cầu!</strong>
                        </p>
                    </div>

                    <div class="part2-context-box">
                        <h3>🌍 Bối cảnh mới: Cuộc chiến thương mại Mỹ-Trung</h3>
                        <p>
                            Năm 2022-2024, căng thẳng địa chính trị leo thang. Hàn Quốc bị kẹt giữa hai siêu cường. 
                            Mỗi lựa chọn đều có cái giá - không có con đường nào hoàn hảo!
                        </p>
                        <div class="part2-context-inner">
                            <p>
                                ⚡ <strong>Thử thách:</strong> Bạn phải chọn liên minh từ vòng 6 và đối phó với hậu quả!
                            </p>
                        </div>
                    </div>

                    <div class="part2-info-text">
                        <p>🎯 <strong>Mục tiêu Part 2:</strong> Đạt 85+ điểm cho cả 4 chỉ số!</p>
                        <p>💰 <strong>Ngân sách:</strong> Vẫn 100 điểm/vòng × 5 vòng (1-5)</p>
                        <p style="margin-bottom: 24px;">🌍 <strong>Đặc biệt:</strong> Phải chọn liên minh quốc tế ở vòng 1!</p>
                    </div>

                    <button onclick="startPart2()" class="btn-primary">
                        🚀 Bắt đầu Part 2: Địa chính trị!
                    </button>
                </div>
            `;
        }

        function renderPart3Intro() {
            return `
                <div class="card part3-intro-container fade-in">
                    <div class="icon-large bounce">🏢</div>
                    <h1 class="part3-intro-title">
                        Part 3: Đế chế Chaebol
                    </h1>
                    
                    <div class="part3-intro-box purple">
                        <h3>🎭 Đảo vai hoàn toàn!</h3>
                        <p style="font-size: 1.125rem; margin-bottom: 16px;">Bây giờ bạn là <strong>Chủ tịch Tập đoàn Samsung</strong>!</p>
                        <p style="font-size: 1rem; color: #4b5563;">
                            Từ góc nhìn của tư bản độc quyền - hiểu tại sao họ có sức mạnh như vậy!
                        </p>
                    </div>

                    <div class="part3-intro-box yellow">
                        <h3>🎯 Nhiệm vụ của Chaebol:</h3>
                        <ul>
                            <li>🏭 <strong>Cạnh tranh</strong> với doanh nghiệp nhà nước</li>
                            <li>🤝 <strong>Thuyết phục</strong> chính phủ ân xá, quay lại điều hành</li>
                            <li>💰 <strong>Đàm phán</strong> chính sách thuế, đầu tư quốc tế</li>
                            <li>📊 <strong>Tối ưu</strong> 4 chỉ số: Lợi nhuận - Uy tín - Quan hệ Nhà nước - Thị trường</li>
                        </ul>
                    </div>

                    <div class="part3-intro-box red">
                        <h3>⚡ Độ khó cực cao!</h3>
                        <ul>
                            <li>⏰ <strong>Thời gian ngắn:</strong> Chỉ 5 vòng (thay vì 10)</li>
                            <li>📉 <strong>Sự kiện tiêu cực:</strong> Trừ điểm mạnh tay</li>
                            <li>🎯 <strong>Mục tiêu khó:</strong> 85+ điểm cho cả 4 chỉ số</li>
                            <li>⚖️ <strong>Cân bằng khó:</strong> Lợi nhuận vs Uy tín vs Chính trị</li>
                        </ul>
                    </div>

                    <div class="part3-intro-box blue">
                        <h3>🎓 Bạn sẽ hiểu được:</h3>
                        <ul>
                            <li>💡 <strong>Động cơ</strong> và sức mạnh của tư bản độc quyền</li>
                            <li>🤔 Tại sao Nhà nước <strong>"phải"</strong> dựa vào họ trong khủng hoảng</li>
                            <li>🔗 Mối quan hệ <strong>cộng sinh</strong> giữa chính quyền và chaebol</li>
                            <li>⚖️ <strong>Mâu thuẫn</strong> giữa lợi nhuận tư nhân và lợi ích xã hội</li>
                        </ul>
                    </div>

                    <button onclick="startPart3()" class="btn-primary">
                        🏢 Trở thành Chủ tịch Samsung!
                    </button>
                </div>
            `;
        }

        function renderFinalSummary() {
            const part1 = state.partResults.part1;
            const part2 = state.partResults.part2;
            const part3 = state.partResults.part3;
            
            const overallSuccess = (part1?.success && part2?.success && part3?.success);
            
            return `
                <div class="card final-summary-container fade-in">
                    <div class="final-summary-icon bounce">${overallSuccess ? '👑' : '🎓'}</div>
                    <h1 class="final-summary-title">
                        ${overallSuccess ? 'Bậc Thầy Kinh Tế Chính Trị!' : 'Hành trình học tập hoàn thành!'}
                    </h1>
                    
                    <div class="final-summary-grid">
                        <div class="card final-part-card ${part1?.success ? 'success' : 'fail'}">
                            <div class="final-part-icon">🏛️</div>
                            <h3 class="final-part-title">Part 1: Thủ tướng</h3>
                            <div class="final-part-status ${part1?.success ? 'success' : 'fail'}">
                                ${part1?.success ? '✅ PASS' : '❌ FAIL'}
                            </div>
                            <p class="final-part-description">${part1?.title}</p>
                            <div class="final-part-stats">
                                <div>📈 GDP: ${state.partResults.part1?.stats?.gdp?.toFixed(1) || 'N/A'}</div>
                                <div>⚖️ Công bằng: ${state.partResults.part1?.stats?.equality?.toFixed(1) || 'N/A'}</div>
                                <div>💬 Niềm tin: ${state.partResults.part1?.stats?.trust?.toFixed(1) || 'N/A'}</div>
                            </div>
                        </div>
                        
                        <div class="card final-part-card ${part2?.success ? 'success' : 'fail'}">
                            <div class="final-part-icon">🌏</div>
                            <h3 class="final-part-title">Part 2: Địa chính trị</h3>
                            <div class="final-part-status ${part2?.success ? 'success' : 'fail'}">
                                ${part2?.success ? '✅ PASS' : '❌ FAIL'}
                            </div>
                            <p class="final-part-description">${part2?.title}</p>
                            <div class="final-part-stats">
                                <div>📈 GDP: ${state.partResults.part2?.stats?.gdp?.toFixed(1) || 'N/A'}</div>
                                <div>⚖️ Công bằng: ${state.partResults.part2?.stats?.equality?.toFixed(1) || 'N/A'}</div>
                                <div>💬 Niềm tin: ${state.partResults.part2?.stats?.trust?.toFixed(1) || 'N/A'}</div>
                                <div>🌍 Quốc tế: ${state.partResults.part2?.stats?.international?.toFixed(1) || 'N/A'}</div>
                                <div style="margin-top: 8px; font-weight: bold;">🤝 Liên minh: ${state.alliance ? allianceOptions.find(a => a.id === state.alliance)?.name : 'Không chọn'}</div>
                            </div>
                        </div>
                        
                        <div class="card final-part-card ${part3?.success ? 'success' : 'fail'}">
                            <div class="final-part-icon">🏢</div>
                            <h3 class="final-part-title">Part 3: Chaebol</h3>
                            <div class="final-part-status ${part3?.success ? 'success' : 'fail'}">
                                ${part3?.success ? '✅ PASS' : '❌ FAIL'}
                            </div>
                            <p class="final-part-description">${part3?.title}</p>
                            <div class="final-part-stats">
                                <div>💰 Lợi nhuận: ${state.chaebollStats.profit.toFixed(1)}</div>
                                <div>⭐ Uy tín: ${state.chaebollStats.reputation.toFixed(1)}</div>
                                <div>🏛️ Chính phủ: ${state.chaebollStats.government.toFixed(1)}</div>
                                <div>📊 Thị trường: ${state.chaebollStats.market.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>

                    <div class="final-lesson-box">
                        <h3>🎓 Bài học tổng kết</h3>
                        <p><strong>✅ Chủ nghĩa tư bản độc quyền nhà nước:</strong> Bạn đã trải nghiệm cách Nhà nước và tập đoàn lớn hợp tác để vượt qua khủng hoảng.</p>
                        <p><strong>🌍 Xuất khẩu tư bản:</strong> Thấy được cách các cường quốc tranh giành ảnh hưởng kinh tế toàn cầu.</p>
                        <p><strong>🏢 Quyền lực tư bản:</strong> Hiểu tại sao các chaebol có thể "bắt tay" với chính phủ và ảnh hưởng chính sách.</p>
                        <p><strong>⚖️ Mâu thuẫn cơ bản:</strong> Không thể đồng thời tối đa hóa tăng trưởng, công bằng, và độc lập - luôn phải đánh đổi.</p>
                    </div>

                    <div class="final-message ${overallSuccess ? 'success' : 'fail'}">
                        ${overallSuccess ? 
                            '🏆 Chúc mừng! Bạn đã thành thạo cả 3 góc nhìn về kinh tế chính trị!' : 
                            '📚 Hành trình học tập quý báu! Mỗi thất bại đều là bài học.'
                        }
                    </div>

                    <button onclick="resetGame()" class="btn-primary">
                        🔄 Chơi lại từ đầu
                    </button>
                </div>
            `;
        }

        function startPart2() {
            state.screen = 'game';
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function startPart3() {
            state.screen = 'game';
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function resetGame() {
            state.screen = 'intro';
            state.currentPart = 1;
            state.budget = 100;
            state.investments = { state: 0, chaebols: 0, welfare: 0, tech: 0 };
            state.totalInvested = { state: 0, chaebols: 0, welfare: 0, tech: 0 };
            state.stats = { gdp: 35.0, equality: 35.0, trust: 35.0, international: 50.0 };
            state.chaebollStats = { profit: 35.0, reputation: 35.0, government: 35.0, market: 35.0 };
            state.round = 1;
            state.maxRounds = 5;
            state.news = [];
            state.events = [];
            state.alliance = null;
            state.phase = 1;
            state.storyContext = {
                currentEvent: 'covid_crisis',
                timeline: []
            };
            state.partResults = { part1: null, part2: null, part3: null };
            function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            // Check Game Over sau Chaebol event
            if (checkGameOver()) {
                return;
            }
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        render();
        }

        function createConfetti() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 0.5 + 's';
                    document.body.appendChild(confetti);
                    setTimeout(() => confetti.remove(), 2000);
                }, i * 50);
            }
        }

        function showMessage(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-2xl font-bold text-xl z-50 ${
                type === 'error' ? 'bg-red-400' : 'bg-green-400'
            } text-white shadow-lg shake`;
            messageDiv.style.cssText = `
                position: fixed;
                top: 16px;
                left: 50%;
                transform: translateX(-50%);
                padding: 16px 24px;
                border-radius: 16px;
                font-weight: bold;
                font-size: 1.25rem;
                z-index: 50;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            `;
            messageDiv.style.backgroundColor = type === 'error' ? '#f87171' : '#34d399';
            messageDiv.style.color = 'white';
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            
            playSound(type === 'error' ? 'error' : 'success');
            
            setTimeout(() => messageDiv.remove(), 2000);
        }

        function showBudgetWarning(costNeeded) {
            // Xóa warning cũ nếu có
            const oldWarning = document.querySelector('.budget-warning');
            if (oldWarning) oldWarning.remove();
            
            const warningDiv = document.createElement('div');
            warningDiv.className = 'budget-warning';
            warningDiv.textContent = `Không đủ ngân sách! Cần ${costNeeded} điểm.`;
            document.body.appendChild(warningDiv);
            
            playSound('error');
            
            // Auto remove sau 3 giây
            setTimeout(() => warningDiv.remove(), 3000);
        }

        function checkGameOver() {
            let failedStat = null;
            
            if (state.currentPart === 3) {
                // Check Part 3 stats
                if (state.chaebollStats.profit <= 0) failedStat = 'Lợi nhuận';
                if (state.chaebollStats.reputation <= 0) failedStat = 'Uy tín';
                if (state.chaebollStats.government <= 0) failedStat = 'Quan hệ Chính phủ';
                if (state.chaebollStats.market <= 0) failedStat = 'Thị trường';
            } else {
                // Check Part 1 & 2 stats
                if (state.stats.gdp <= 0) failedStat = 'GDP';
                if (state.stats.equality <= 0) failedStat = 'Công bằng';
                if (state.stats.trust <= 0) failedStat = 'Niềm tin';
                if (state.currentPart !== 1 && state.stats.international <= 0) failedStat = 'Quốc tế';
            }
            
            if (failedStat) {
                showGameOver(failedStat);
                return true;
            }
            return false;
        }

        function showGameOver(failedStat) {
            const gameOverDiv = document.createElement('div');
            gameOverDiv.className = 'game-over-modal fade-in';
            
            const currentStats = state.currentPart === 3 ? state.chaebollStats : state.stats;
            const statNames = state.currentPart === 3 ? 
                { profit: 'Lợi nhuận', reputation: 'Uy tín', government: 'Chính phủ', market: 'Thị trường' } :
                { gdp: 'GDP', equality: 'Công bằng', trust: 'Niềm tin', international: 'Quốc tế' };
            
            gameOverDiv.innerHTML = `
                <div class="game-over-content">
                    <div class="game-over-icon">💀</div>
                    <h2 class="game-over-title">Game Over!</h2>
                    <p class="game-over-message">
                        Chỉ số <strong>${failedStat}</strong> đã về 0. Bạn đã thất bại!
                    </p>
                    <div class="game-over-stats">
                        <h4 style="font-weight: bold; margin-bottom: 12px;">Chỉ số cuối cùng:</h4>
                        ${Object.entries(currentStats).map(([key, value]) => `
                            <div>${statNames[key]}: ${value.toFixed(1)}</div>
                        `).join('')}
                    </div>
                    <button onclick="this.parentElement.parentElement.remove(); resetGame();" class="game-over-btn">
                        🔄 Về màn hình đầu
                    </button>
                </div>
            `;
            document.body.appendChild(gameOverDiv);
            
            playSound('error');
        }

        function showInvestmentVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section vision">
                        <h4 class="modal-section-title">🔮 Viễn cảnh 5 năm tới:</h4>
                        <p class="modal-section-text">
                            ${getInvestmentVision(option.id)}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học kinh tế chính trị:</h4>
                        <p class="modal-section-text">
                            ${getInvestmentLesson(option.id)}
                        </p>
                    </div>
                    
                    <div class="modal-stats ${state.currentPart === 1 ? '' : 'cols-4'}">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.gdp >= 0 ? 'positive' : 'negative'}">
                                ${effects.gdp >= 0 ? '+' : ''}${effects.gdp.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📈 GDP</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.equality >= 0 ? 'positive' : 'negative'}">
                                ${effects.equality >= 0 ? '+' : ''}${effects.equality.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⚖️ Công bằng</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.trust >= 0 ? 'positive' : 'negative'}">
                                ${effects.trust >= 0 ? '+' : ''}${effects.trust.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💬 Niềm tin</div>
                        </div>
                        ${state.currentPart !== 1 ? `
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.international >= 0 ? 'positive' : 'negative'}">
                                ${effects.international >= 0 ? '+' : ''}${effects.international.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🌍 Quốc tế</div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function getInvestmentVision(id) {
            const visions = {
                state: 'Doanh nghiệp nhà nước sẽ trở thành trụ cột ổn định, tạo việc làm bền vững và kiểm soát lạm phát. Tuy nhiên, hiệu quả có thể giảm do thiếu cạnh tranh, và gánh nặng ngân sách tăng cao.',
                chaebols: 'Các chaebol sẽ thống trị thị trường, tạo ra "kỳ tích kinh tế" với tăng trưởng xuất khẩu mạnh mẽ. Nhưng khoảng cách giàu nghèo sẽ gia tăng, và quyền lực tập trung vào ít gia đình.',
                welfare: 'Hệ thống phúc lợi mạnh sẽ tạo ra xã hội ổn định, giảm tội phạm và tăng hạnh phúc. Tuy nhiên, gánh nặng thuế cao có thể làm giảm động lực đầu tư tư nhân.',
                tech: 'Đầu tư công nghệ sẽ biến Hàn Quốc thành "Silicon Valley châu Á", thu hút nhân tài toàn cầu. Nhưng cần thời gian dài mới thấy kết quả và có thể tạo ra "bong bóng công nghệ".'
            };
            return visions[id] || 'Chưa có dự đoán cho lựa chọn này.';
        }

        function getInvestmentLesson(id) {
            const lessons = {
                state: 'Nhà nước can thiệp mạnh vào kinh tế là đặc trưng của "chủ nghĩa tư bản độc quyền nhà nước" - mô hình Hàn Quốc, Nhật Bản thành công.',
                chaebols: 'Tập đoàn tư bản lớn liên kết với nhà nước tạo ra "tư bản độc quyền" - có thể thúc đẩy tăng trưởng nhưng gây bất bình đẳng.',
                welfare: 'Chính sách phúc lợi là cách nhà nước "hợp pháp hóa" hệ thống tư bản bằng cách giảm mâu thuẫn xã hội.',
                tech: 'Đầu tư R&D của nhà nước là cách tạo ra "lợi thế cạnh tranh quốc gia" trong nền kinh tế tri thức toàn cầu.'
            };
            return lessons[id] || 'Bài học đang được cập nhật.';
        }

        function playSound(type) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'invest') {
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } else if (type === 'error') {
                oscillator.frequency.value = 200;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'success') {
                oscillator.frequency.value = 1000;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }
        }

        function calculateChaebollEffects(option, id) {
            let effects = { ...option.baseEffects };
            
            // Diminishing returns cho Part 3 (giống Part 1 & 2)
            const investmentLevel = state.totalInvested[id] / 25;
            const diminishingFactor = Math.max(0.3, 1 - (investmentLevel * 0.2));
            
            effects.profit *= diminishingFactor;
            effects.reputation *= diminishingFactor;
            effects.government *= diminishingFactor;
            effects.market *= diminishingFactor;
            
            // Synergy effects cho Chaebol (tính theo level đầu tư)
            const lobbyLevel = (state.totalInvested.lobby || 0) / 25;
            const innovationLevel = (state.totalInvested.innovation || 0) / 25;
            const expansionLevel = (state.totalInvested.expansion || 0) / 25;
            const socialLevel = (state.totalInvested.social || 0) / 25;
            
            if (lobbyLevel > 0 && innovationLevel > 0) {
                effects.profit += Math.min(lobbyLevel, innovationLevel) * 2.0; // Lobby + Innovation = lợi nhuận cao
                effects.government += Math.min(lobbyLevel, innovationLevel) * 1.5;
            }
            
            if (expansionLevel > 0 && innovationLevel > 0) {
                effects.market += Math.min(expansionLevel, innovationLevel) * 3.0; // Expansion + Innovation = thống trị thị trường
                effects.reputation += Math.min(expansionLevel, innovationLevel) * 1.0;
            }
            
            if (socialLevel > 0 && lobbyLevel > 0) {
                effects.reputation += Math.min(socialLevel, lobbyLevel) * 2.5; // CSR + Lobby = hình ảnh tốt
                effects.government += Math.min(socialLevel, lobbyLevel) * 1.0;
            }
            
            return effects;
        }

        function showChaebollVision(option, effects) {
            const visionDiv = document.createElement('div');
            visionDiv.className = 'modal-overlay fade-in';
            visionDiv.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">${option.icon}</div>
                        <h3 class="modal-title">${option.name}</h3>
                        <p class="modal-subtitle">${option.description}</p>
                    </div>
                    
                    <div class="modal-section" style="background: linear-gradient(to right, #faf5ff, #fce7f3);">
                        <h4 class="modal-section-title" style="color: #7c3aed;">🔮 Viễn cảnh chiến lược:</h4>
                        <p class="modal-section-text">
                            ${option.vision}
                        </p>
                    </div>
                    
                    <div class="modal-section lesson">
                        <h4 class="modal-section-title">📚 Bài học về tư bản độc quyền:</h4>
                        <p class="modal-section-text">
                            ${option.lesson}
                        </p>
                    </div>
                    
                    <div class="modal-stats" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.profit >= 0 ? 'positive' : 'negative'}">
                                ${effects.profit >= 0 ? '+' : ''}${effects.profit.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">💰 Lợi nhuận</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.reputation >= 0 ? 'positive' : 'negative'}">
                                ${effects.reputation >= 0 ? '+' : ''}${effects.reputation.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">⭐ Uy tín</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.government >= 0 ? 'positive' : 'negative'}">
                                ${effects.government >= 0 ? '+' : ''}${effects.government.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">🏛️ Chính phủ</div>
                        </div>
                        <div class="modal-stat-item">
                            <div class="modal-stat-value ${effects.market >= 0 ? 'positive' : 'negative'}">
                                ${effects.market >= 0 ? '+' : ''}${effects.market.toFixed(1)}
                            </div>
                            <div class="modal-stat-label">📊 Thị trường</div>
                        </div>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="modal-close-btn" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);">
                        ✅ Hiểu rồi!
                    </button>
                </div>
            `;
            document.body.appendChild(visionDiv);
        }

        function triggerChaebollEvent() {
            const chaebollEvents = [
                {
                    name: '🏛️ Điều tra tham nhũng',
                    effects: { profit: -8.0, reputation: -12.0, government: -15.0, market: -5.0 },
                    description: 'Chính phủ điều tra các khoản vận động hành lang bất hợp pháp!'
                },
                {
                    name: '💸 Khủng hoảng tài chính toàn cầu',
                    effects: { profit: -12.0, reputation: -3.0, government: 2.0, market: -10.0 },
                    description: 'Thị trường chứng khoán sụp đổ, nhà nước cần Samsung cứu nền kinh tế!'
                },
                {
                    name: '🏭 Đình công công nhân',
                    effects: { profit: -10.0, reputation: -8.0, government: -5.0, market: -6.0 },
                    description: 'Công nhân yêu cầu tăng lương và cải thiện điều kiện làm việc!'
                },
                {
                    name: '🌍 Trừng phạt quốc tế',
                    effects: { profit: -15.0, reputation: -10.0, government: -8.0, market: -12.0 },
                    description: 'EU và Mỹ áp đặt trừng phạt vì vi phạm cạnh tranh!'
                },
                {
                    name: '🔥 Sự cố sản phẩm',
                    effects: { profit: -8.0, reputation: -15.0, government: -3.0, market: -10.0 },
                    description: 'Galaxy Note 7 phát nổ, uy tín Samsung tụt dốc không phanh!'
                },
                {
                    name: '⚖️ Kiện tụng bản quyền',
                    effects: { profit: -6.0, reputation: -5.0, government: 0, market: -8.0 },
                    description: 'Apple kiện Samsung vi phạm bản quyền, tòa án yêu cầu bồi thường!'
                }
            ];
            
            const event = chaebollEvents[Math.floor(Math.random() * chaebollEvents.length)];
            
            state.chaebollStats.profit = Math.max(0, Math.min(100, state.chaebollStats.profit + event.effects.profit));
            state.chaebollStats.reputation = Math.max(0, Math.min(100, state.chaebollStats.reputation + event.effects.reputation));
            state.chaebollStats.government = Math.max(0, Math.min(100, state.chaebollStats.government + event.effects.government));
            state.chaebollStats.market = Math.max(0, Math.min(100, state.chaebollStats.market + event.effects.market));
            
            state.events.push(`${event.name} - ${event.description}`);
            
            playSound('error');
        }

        // Attach các function lên window object để có thể gọi từ onclick handlers
        window.startGame = startGame;
        window.showAcademicModal = showAcademicModal;
        window.nextAcademicSlide = nextAcademicSlide;
        window.prevAcademicSlide = prevAcademicSlide;
        window.goBackToIntro = goBackToIntro;
        window.startPart2 = startPart2;
        window.startPart3 = startPart3;
        window.selectInvestment = selectInvestment;
        window.selectChaebollStrategy = selectChaebollStrategy;
        window.selectAlliance = selectAlliance;
        window.nextRound = nextRound;
        window.showFinalResult = showFinalResult;
        window.resetGame = resetGame;
        window.render = render;

        // Đảm bảo DOM đã sẵn sàng trước khi render
        const timer = setTimeout(() => {
            render();
        }, 0);

        return () => {
            clearTimeout(timer);
            // Cleanup: xóa các function khỏi window khi component unmount
            delete window.startGame;
            delete window.showAcademicModal;
            delete window.nextAcademicSlide;
            delete window.prevAcademicSlide;
            delete window.goBackToIntro;
            delete window.startPart2;
            delete window.startPart3;
            delete window.selectInvestment;
            delete window.selectChaebollStrategy;
            delete window.selectAlliance;
            delete window.nextRound;
            delete window.showFinalResult;
            delete window.resetGame;
            delete window.render;
        };
    }, []); // Empty dependency array - runs once on mount

    return (
        <div id="app" className="min-h-full p-4 md:p-8"></div>
    );
}

export default App;
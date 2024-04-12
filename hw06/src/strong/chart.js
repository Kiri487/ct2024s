async function loadData() {
    response = await fetch("./src/simple/wu.csv");
    dataText = await response.text();
    return d3.csvParse(dataText, d => ({
        student: d.Student,
        LPIPS: +d.LPIPS,
        SSIM: +d.SSIM
    }));
}

loadData().then(data => {
    const chartData = {
        datasets: [{
            label: 'Students',
            data: data.map(item => ({
                x: item.SSIM,
                y: item.LPIPS,
                student: item.student,
                imgUrl: `./src/words/wu/${item.student}`
            })),
            backgroundColor: 'rgba(113, 137, 170, 0.8)',
            pointRadius: 5,
            pointHoverRadius: 6
        }]
    };

    const chartOptions = {
        scales: {
            x: { title: { display: true, text: 'SSIM' } },
            y: { title: { display: true, text: 'LPIPS' } }
        },
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        return `Student: ${context.raw.student} - LPIPS: ${context.raw.y}, SSIM: ${context.raw.x}`;
                    }
                }
            }
        },
        onHover: function(event, chart) {
            const img = document.getElementById('word');
            const vs = document.getElementById('vs');

            if (chart.length > 0) {
                const studentData =  chart[0].element.$context.raw;                
                img.src = studentData.imgUrl;
                img.style.display = 'block';    
                vs.style.display = 'block';
            } else {
                img.style.display = 'none';
                vs.style.display = 'none';
            }
        }
    };

    new Chart(document.getElementById('chart').getContext('2d'), {
        type: 'scatter',
        data: chartData,
        options: chartOptions
    });
});
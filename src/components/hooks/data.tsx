export const generateData = (numMetrics: number, numWeeks: number) => {
    const data = [];

    for (let i = 0; i < numMetrics; i++) {
        const metricData = [];
        for (let j = 0; j < numWeeks; j++) {
            // Generar un valor aleatorio entre 0 y 100
            metricData.push(Math.floor(Math.random() * 101));
        }
        data.push({
            name: `Metric${i + 1}`,
            data: metricData,
        });
    }

    return data;
};

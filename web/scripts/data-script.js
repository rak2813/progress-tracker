document.addEventListener('DOMContentLoaded', async function() {
    var ctx = document.getElementById('myChart').getContext('2d');
    // Get the current URL
    const url = new URL(window.location.href);
// Use URLSearchParams to get the exerciseId
    const exerciseId = url.searchParams.get('exerciseId');

    var dbData = await fetch(`${API_BASE_URL}/data/exercise/${exerciseId}`);
    var dbData = await dbData.json();
    var name = dbData.name;
    var data = dbData.data;

    var myChart = new Chart(ctx, {
        type: 'line', // Choose 'line', 'pie', 'doughnut', etc.
        data: {
            labels: data.map(data => data.date), // Format the date to look better
            datasets: [{
                label: 'Weight',
                data: data.map(data => data.weight),
                borderWidth: 3, // Increase the line thickness
                borderColor: 'rgb(195, 255, 0)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill area under the line
            }]
        },
        options: {
            responsive: true, // Make the chart responsive to different screen sizes
            maintainAspectRatio: false, // Allow the chart to stretch to the container
            plugins: {
                title: {
                    display: true,
                    text: name, // Set your title text here
                    position: 'bottom', // Position the title at the bottom
                    font: {
                        size: 20 // Set a smaller title font size for mobile
                    },
                    padding: {
                        top: 10, // Space between the chart and the title
                        bottom: 10 // Space below the title
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 12 // Decrease legend font size for mobile
                        },
                        padding: 10 // Add space around legend items
                    }
                },
                tooltip: {
                    bodyFont: {
                        size: 12 // Decrease tooltip font size
                    },
                    padding: 8, // Add padding inside the tooltip
                    boxPadding: 5 // Add padding between tooltip box and text
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 12 // Decrease x-axis label font size for mobile
                        },
                        padding: 5 // Add space between x-axis labels and axis
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12 // Decrease y-axis label font size for mobile
                        },
                        padding: 5 // Add space between y-axis labels and axis
                    }
                }
            },
            layout: {
                padding: {
                    top: 10, // Add space above the chart
                    bottom: 10, // Add space below the chart
                    left: 10, // Add space on the left side of the chart
                    right: 10 // Add space on the right side of the chart
                }
            }
        }
    });
    

    // var myChart = new Chart(ctx, {
    //     type: 'line', // Choose 'line', 'pie', 'doughnut', etc.
    //     data: {
    //         labels: data.map(data => data.date), // Format the date to look better
    //         datasets: [{
    //             label: 'Weight',
    //             data: data.map(data => data.weight),
    //             borderWidth: 3, // Increase the line thickness
    //             borderColor: 'rgb(195, 255, 0)', // Line color
    //             backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill area under the line
    //         }]
    //     },
    //     options: {
    //         responsive: true, // Make the chart responsive to different screen sizes
    //         plugins: {
    //             title: {
    //                 display: true,
    //                 text: name, // Set your title text here
    //                 position: 'bottom', // Position the title at the bottom
    //                 font: {
    //                     size: 30 // Set the title font size
    //                 },
    //                 padding: {
    //                     top: 10, // Space between the chart and the title
    //                     bottom: 20 // Space below the title
    //                 }
    //             },
    //             legend: {
    //                 labels: {
    //                     font: {
    //                         size: 14 // Increase legend font size
    //                     },
    //                     padding: 20 // Add space around legend items
    //                 }
    //             },
    //             tooltip: {
    //                 bodyFont: {
    //                     size: 14 // Increase tooltip font size
    //                 },
    //                 padding: 10, // Add padding inside the tooltip
    //                 boxPadding: 5 // Add padding between tooltip box and text
    //             }
    //         },
    //         scales: {
    //             x: {
    //                 ticks: {
    //                     font: {
    //                         size: 14 // Increase x-axis label font size
    //                     },
    //                     padding: 10 // Add space between x-axis labels and axis
    //                 }
    //             },
    //             y: {
    //                 beginAtZero: true,
    //                 ticks: {
    //                     font: {
    //                         size: 14 // Increase y-axis label font size
    //                     },
    //                     padding: 10 // Add space between y-axis labels and axis
    //                 }
    //             }
    //         },
    //         layout: {
    //             padding: {
    //                 top: 20, // Add space above the chart
    //                 bottom: 20, // Add space below the chart
    //                 left: 20, // Add space on the left side of the chart
    //                 right: 20 // Add space on the right side of the chart
    //             }
    //         }
    //     }
    // });
    
    
});



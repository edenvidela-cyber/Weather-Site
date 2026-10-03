// this is the info and greeting generator for the user, it also includes the color of the day and a random motivational quote //   

$(document).ready(function() {
    
    // Greeting
    const hour = new Date().getHours();
    let greetingText = "";
    let iconSrc = "";

    // Map time ranges to text AND specific images
    if (hour < 12) {
        greetingText = "Good Morning";
        iconSrc = "images/coffee_morning.png"; 
    } else if (hour < 18) {
        greetingText = "Good Afternoon";
        iconSrc = "images/sunset_afternoon.png"; 
    } else {
        greetingText = "Good Evening";
        iconSrc = "images/moon_evening.png"; 
    }

    $("#user_greeting_text").text(greetingText);


    $("#greeting_icon").attr("src", iconSrc);

    // Random Motivational Message
    const quotes = [
        "Small progress is still progress.",
        "Your only limit is your mind.",
        "Build the future you want to see.",
        "Precision in code, passion in life."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    $("#motivational_quote").text(`"${randomQuote}"`);

    // Color of the Day Logic
    const colors = [
        { name: "Sunset Orange", hex: "#FF5F1F" },
        { name: "Electric Blue", hex: "#00FFFF" },
        { name: "Forest Green", hex: "#228B22" },
        { name: "Gold", hex: "#FFD700" }
    ];
    // Select color based on the date so it only changes once a day
    const dayOfMonth = new Date().getDate();
    const colorIndex = dayOfMonth % colors.length;
    const selectedColor = colors[colorIndex];

    $("#daily_color_name").text(selectedColor.name);

    $("#daily_color_swatch").css("background-color", selectedColor.hex);

    // Special Day Check
    const today = new Date();
    if (today.getMonth() === 3 && today.getDate() === 10) {
        $("#user_greeting").append(" 🎈 <br> Happy World Sibling Day!");
    }
});

// this is the converter or calculator for Celsius to Fahrenheit //
$(document).ready(function() {
    
    $("#Cel_Fah").click(function() {
        let celVal = $("#Celcius").val();
        
        let celsius = parseFloat(celVal);

        if (isNaN(celsius)) {
            $("#calc_result").text("Please enter a valid number.");
            return;
        }

        let fahrenheit = (celsius * 1.8) + 32;

        $("#calc_result").text(fahrenheit.toFixed(1) + "°F");
        
        console.log("Converted " + celsius + " to " + fahrenheit);
    });

});


// this is the weather API fetcher and functions //
$(document).ready(function() {
    $("#Fetch_weather").click(function() {
        // Add your API key here!!!
        const apiKey = "enter the api key here!!!";
        const city = $("#city_name").val();
        
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no`;
        
        if (!city) {
            handleError("Please enter a location.");
            return;
        }

        $.get(url, function(data) {
            $("#error_log").addClass("hidden");
            buildDashboard(data.forecast.forecastday);
        }).fail(function() {
            handleError("Location not found. Check spelling!");
        });
    });


    function buildDashboard(days) {
        const mainDisplay = $("#dashboard_results");
        mainDisplay.empty(); 

        days.forEach((day, index) => {
            const carouselID = `day-carousel-${index}`;
            
            // Create the Section for the Day
            let dayHTML = `
                <section class="day-container">
                    <div class="day-header">
                        <h2>${day.date}</h2>
                    </div>
                    <div id="${carouselID}" class="owl-carousel owl-theme">
                        </div>
                </section>`;
            
            mainDisplay.append(dayHTML);
            const currentCarousel = $(`#${carouselID}`);

            // Loop through the 24 hours for THIS day
            day.hour.forEach(hr => {
                const timeOnly = hr.time.split(" ")[1];
                let hourHTML = `
                    <div class="hour-card">
                        <p class="hour-time">${timeOnly}</p>
                        <img src="${hr.condition.icon}" alt="weather icon">
                        <p>${hr.temp_c}°C</p>
                        <p>${hr.condition.text}</p>
                    </div>`;
                currentCarousel.append(hourHTML);
            });

            // Initialize Owl Carousel for this specific day's slider
            currentCarousel.owlCarousel({
                loop: false,
                margin: 10,
                nav: false,
                dots: false,
                responsive: {
                    0: { items: 3 },
                    600: { items: 6 },
                    1000: { items: 10 }
                }
            });
        });
    }

    function handleError(msg) {
        const errorP = $("#error_log");
        errorP.text(msg);
        errorP.removeClass("hidden").addClass("error-state");
    }
});
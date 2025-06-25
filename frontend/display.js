document.addEventListener('DOMContentLoaded', function () {
    fetchPlanData();

    document.addEventListener('click', function (e) {
        const dayHeader = e.target.closest('.day-header');
        if (dayHeader) {
            const dayCard = dayHeader.parentElement;
            toggleDayCard(dayCard);
        }
    });
});

function toggleDayCard(dayCard) {
    dayCard.classList.toggle('active');

    if (dayCard.classList.contains('active')) {
        animateActivities(dayCard);
    }
}

function animateActivities(dayCard) {
    const activities = dayCard.querySelectorAll('.activity');
    activities.forEach((activity, index) => {
        activity.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        activity.style.animation = 'none';
        activity.offsetHeight;
        activity.style.animation = null;
    });
}

function fetchPlanData() {
    try {
        const planString = localStorage.getItem("Plan");

        if (!planString) {
            throw new Error("No plan data found. Please generate a plan first.");
        }

        const plan = JSON.parse(planString);
        displayPlan(plan);

    } catch (error) {
        console.error('Error processing plan data:', error);
        document.getElementById('plan-container').innerHTML = `
            <div class="error">
                <p>Could not load your holiday plan. Please try again.</p>
            </div>
        `;
    }
}

function displayPlan(plan) {
    document.getElementById('plan-title').textContent = `${plan.location} Holiday Plan`;
    document.getElementById('plan-subtitle').textContent =
        `${capitalizeFirstLetter(plan.group_type)} trip - ${plan.no_of_days} days`;

    document.getElementById('location').innerHTML =
        `<i class="fas fa-map-marker-alt"></i> ${plan.location}`;
    document.getElementById('budget').innerHTML =
        `<i class="fas fa-rupee-sign"></i> ${formatNumber(plan.total_budget)}`;
    document.getElementById('days').innerHTML =
        `<i class="fas fa-calendar-day"></i> ${plan.no_of_days} days`;
    document.getElementById('people').innerHTML =
        `<i class="fas fa-users"></i> ${plan.no_of_people} ${plan.no_of_people > 1 ? 'people' : 'person'}`;

    const planContainer = document.getElementById('plan-container');
    planContainer.innerHTML = '';

    if (!plan.days || plan.days.length === 0) {
        planContainer.innerHTML = '<div class="error">No itinerary data found in the plan.</div>';
        return;
    }

    plan.days.forEach(day => {
        const dayCard = createDayCard(day);
        planContainer.appendChild(dayCard);
    });

    if (plan.suggested_hotels && plan.suggested_hotels.length > 0) {
        const hotelsSection = createHotelsSection(plan.suggested_hotels);
        planContainer.appendChild(hotelsSection);
    }

    if (plan.suggested_restaurants && plan.suggested_restaurants.length > 0) {
        const restaurantsSection = createRestaurantsSection(plan.suggested_restaurants);
        planContainer.appendChild(restaurantsSection);
    }

    displayAdditionalInfo(plan);

    if (planContainer.querySelector('.day-card')) {
        toggleDayCard(planContainer.querySelector('.day-card'));
    }
}

function createDayCard(day) {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';

    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';

    const dayTitle = document.createElement('h2');
    let titleText = `Day ${day.day}: ${day.title}`;
    dayTitle.textContent = titleText;

    if (day.highlight) {
        const highlightBadge = document.createElement('span');
        highlightBadge.className = 'highlight-badge';
        highlightBadge.textContent = 'Highlight';
        dayTitle.appendChild(highlightBadge);
    }

    const toggleIcon = document.createElement('i');
    toggleIcon.className = 'fas fa-chevron-down toggle-icon';

    dayHeader.appendChild(dayTitle);
    dayHeader.appendChild(toggleIcon);

    const dayContent = document.createElement('div');
    dayContent.className = 'day-content';

    if (day.schedule && day.schedule.length > 0) {
        day.schedule.forEach(item => {
            const activityElement = createActivityElement({
                time: item.time,
                description: item.activity,
                location: item.location
            });
            dayContent.appendChild(activityElement);
        });
    } else {
        const noActivities = document.createElement('p');
        noActivities.textContent = 'No activities planned for this day.';
        dayContent.appendChild(noActivities);
    }

    if (day.notes) {
        const notesElement = document.createElement('div');
        notesElement.className = 'day-notes';
        notesElement.innerHTML = `<h3>Notes:</h3><p>${day.notes}</p>`;
        dayContent.appendChild(notesElement);
    }

    dayCard.appendChild(dayHeader);
    dayCard.appendChild(dayContent);

    return dayCard;
}

function createActivityElement(activity) {
    const activityElement = document.createElement('div');
    activityElement.className = 'activity';

    if (activity.time) {
        const timeElement = document.createElement('div');
        timeElement.className = 'activity-time';
        timeElement.textContent = activity.time;
        activityElement.appendChild(timeElement);
    }

    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'activity-description';
    descriptionElement.textContent = activity.description || '';
    activityElement.appendChild(descriptionElement);

    if (activity.location) {
        const locationElement = document.createElement('div');
        locationElement.className = 'activity-location';
        locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${activity.location}`;
        activityElement.appendChild(locationElement);
    }

    return activityElement;
}

function createHotelsSection(hotels) {
    const section = document.createElement('div');
    section.className = 'suggestion-section';

    const title = document.createElement('h2');
    title.className = 'suggestion-title';
    title.textContent = 'Suggested Hotels';
    section.appendChild(title);

    const list = document.createElement('div');
    list.className = 'suggestion-list';

    hotels.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';

        const name = document.createElement('h3');
        name.textContent = hotel.name;
        card.appendChild(name);

        if (hotel.rating) {
            const rating = document.createElement('div');
            rating.className = 'rating';

            const stars = '★'.repeat(Math.floor(hotel.rating)) +
                (hotel.rating % 1 >= 0.5 ? '½' : '') +
                '☆'.repeat(5 - Math.ceil(hotel.rating));

            rating.textContent = `${stars} (${hotel.rating})`;
            card.appendChild(rating);
        }

        if (hotel.price_range) {
            const price = document.createElement('div');
            price.className = 'price-category';

            // Get price category from symbols
            const priceLevel = (hotel.price_range.match(/₹/g) || []).length;
            const priceLabel = getPriceCategoryLabel(priceLevel);

            price.innerHTML = `<span class="price-label">Price:</span> <span class="price-value">${priceLabel}</span>`;
            card.appendChild(price);
        }
        if (hotel.features && hotel.features.length > 0) {
            const features = document.createElement('div');
            features.className = 'features';
            features.innerHTML = '<strong>Features:</strong>';

            const featureList = document.createElement('ul');
            hotel.features.forEach(feature => {
                const item = document.createElement('li');
                item.textContent = feature;
                featureList.appendChild(item);
            });

            features.appendChild(featureList);
            card.appendChild(features);
        }

        list.appendChild(card);
    });

    section.appendChild(list);
    return section;
}

function createRestaurantsSection(restaurants) {
    const section = document.createElement('div');
    section.className = 'suggestion-section';

    const title = document.createElement('h2');
    title.className = 'suggestion-title';
    title.textContent = 'Suggested Restaurants';
    section.appendChild(title);

    const list = document.createElement('div');
    list.className = 'suggestion-list';

    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';

        const name = document.createElement('h3');
        name.textContent = restaurant.name;
        card.appendChild(name);

        if (restaurant.cuisine) {
            const cuisine = document.createElement('div');
            cuisine.className = 'cuisine';
            cuisine.textContent = restaurant.cuisine;
            card.appendChild(cuisine);
        }

        if (restaurant.price_range) {
            const price = document.createElement('div');
            price.className = 'price-category';

            const priceLevel = (restaurant.price_range.match(/₹/g) || []).length;
            const priceLabel = getPriceCategoryLabel(priceLevel);

            price.innerHTML = `<span class="price-label">Price:</span> <span class="price-value">${priceLabel}</span>`;
            card.appendChild(price);
        }

        if (restaurant.must_try_dishes && restaurant.must_try_dishes.length > 0) {
            const dishes = document.createElement('div');
            dishes.className = 'dishes';
            dishes.innerHTML = '<strong>Must Try Dishes:</strong>';

            const dishesList = document.createElement('ul');
            restaurant.must_try_dishes.forEach(dish => {
                const item = document.createElement('li');
                item.textContent = dish;
                dishesList.appendChild(item);
            });

            dishes.appendChild(dishesList);
            card.appendChild(dishes);
        }

        list.appendChild(card);
    });

    section.appendChild(list);
    return section;
}

function getPriceCategoryLabel(level) {
    switch (level) {
        case 1: return 'Budget';
        case 2: return 'Economy';
        case 3: return 'Moderate';
        case 4: return 'Premium';
        case 5: return 'Luxury';
        default: return 'Not specified';
    }
}

function displayAdditionalInfo(plan) {
    const additionalInfo = document.getElementById('additional-info');
    additionalInfo.classList.remove('hidden');

    if (plan.weather_forecast) {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = '';

        const weatherGrid = document.createElement('div');
        weatherGrid.className = 'weather-info';

        if (plan.weather_forecast.average_temp) {
            const tempDetail = document.createElement('div');
            tempDetail.className = 'weather-detail';
            tempDetail.innerHTML = `
                <h3>Average Temperature</h3>
                <p>${plan.weather_forecast.average_temp}</p>
            `;
            weatherGrid.appendChild(tempDetail);
        }

        if (plan.weather_forecast.conditions) {
            const conditionsDetail = document.createElement('div');
            conditionsDetail.className = 'weather-detail';
            conditionsDetail.innerHTML = `
                <h3>Conditions</h3>
                <p>${plan.weather_forecast.conditions}</p>
            `;
            weatherGrid.appendChild(conditionsDetail);
        }

        if (plan.weather_forecast.best_time_to_visit) {
            const bestTimeDetail = document.createElement('div');
            bestTimeDetail.className = 'weather-detail';
            bestTimeDetail.innerHTML = `
                <h3>Best Time to Visit</h3>
                <p>${plan.weather_forecast.best_time_to_visit}</p>
            `;
            weatherGrid.appendChild(bestTimeDetail);
        }

        weatherInfo.appendChild(weatherGrid);
    }

    if (plan.travel_tips && plan.travel_tips.length > 0) {
        const tipsElement = document.getElementById('travel-tips');
        tipsElement.innerHTML = '';

        const tipsList = document.createElement('ul');
        plan.travel_tips.forEach(tip => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip;
            tipsList.appendChild(tipItem);
        });

        tipsElement.appendChild(tipsList);
    }

    if (plan.packing_suggestions && plan.packing_suggestions.length > 0) {
        const packingElement = document.getElementById('packing-suggestions');
        packingElement.innerHTML = '';

        const packingList = document.createElement('ul');
        plan.packing_suggestions.forEach(item => {
            const packingItem = document.createElement('li');
            packingItem.textContent = item;
            packingList.appendChild(packingItem);
        });

        packingElement.appendChild(packingList);
    }

    if (plan.local_customs && plan.local_customs.length > 0) {
        const customsElement = document.getElementById('local-customs');
        customsElement.innerHTML = '';

        const customsList = document.createElement('ul');
        plan.local_customs.forEach(custom => {
            const customItem = document.createElement('li');
            customItem.textContent = custom;
            customsList.appendChild(customItem);
        });

        customsElement.appendChild(customsList);
    }

    if (plan.emergency_contacts) {
        const contactsElement = document.getElementById('emergency-contacts');
        contactsElement.innerHTML = '';

        const contactsGrid = document.createElement('div');
        contactsGrid.className = 'contacts-grid';

        for (const [contactType, number] of Object.entries(plan.emergency_contacts)) {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';

            const contactTitle = document.createElement('h3');
            contactTitle.textContent = capitalizeFirstLetter(contactType.replace('_', ' '));

            const contactNumber = document.createElement('div');
            contactNumber.className = 'number';
            contactNumber.textContent = number;

            contactCard.appendChild(contactTitle);
            contactCard.appendChild(contactNumber);
            contactsGrid.appendChild(contactCard);
        }

        contactsElement.appendChild(contactsGrid);
    }
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatNumber(num) {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
}
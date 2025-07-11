function toggleTheme() {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
}


const API_KEY = 'AIzaSyDvHIaJ4X6jysQ_Mq4jGvqVHkZcq9H0LNE';
const SHEET_ID = '1QhKvGz3gv0HpIy3JbVGiE7cn12BAK2ld1LyCjh07-7Q';
const RANGE = 'Лист1!A5:H1000'; // adjust to your range

let dataList = [];
let filteredList = [];
let categories = [];

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
// Завантаження збереженої теми
window.onload = () => {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
    }
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const categoriesContainer = $('#categories');
            dataList = data.values.filter(row => {
                if (row[6] !== undefined && !categories.includes(row[6])) {
                    categories.push(row[6]);
                    categoriesContainer.append('<li onclick="filterByCategory(\'' + row[6] + '\')">' + row[6] + '</li>')
                }
                return row.length > 0;
            });
            filteredList = structuredClone(dataList);
            createPagination();
        }).catch(err => console.error('Error fetching data', err));
}

// Initialize pagination
function createPagination() {
    $('#pagination').pagination({
        dataSource: filteredList,
        pageSize: 12,
        className: 'paginationjs-theme-yellow',
        callback: function (data, pagination) {
            const container = $('#list');
            container.empty();
            let i = 0;
            data.forEach(row => {
                container.append('<div class="item" data-category="???">' +
                    '<a data-fancybox="image-' + i + '" href="' + row[7] + '">' +
                    '<img src="' + row[7] + '" alt="' + row[0] + '">' +
                    '</a>' +
                    '<div class="item-info">' +
                    '<h2>' + row[0] + '</h2>' +
                    '<p><strong>Кількість: </strong>' + row[2] + '</p>' +
                    '<p class="price"><strong>Ціна: ' + row[5] + '</strong></p>' +
                    '<p><strong>Стан: </strong>' + row[4] + '</p>' +
                    '<p class="description">' + row[1] + '</p>' +
                    '</div>' +
                    '</div>');
                i++;
            });

            $('html, body').animate({
                scrollTop: $('#list').offset().top
            }, 300); // 300ms animation
        }
    });
}

function filterByCategory(category) {
    $('#categories').children('.active').removeClass('active');
    $('#categories').children('li:contains(\'' + category + '\')').addClass('active');
    if (category === 'all') {
        filteredList = structuredClone(dataList);
    } else {
        filteredList = [];
        dataList.forEach(row => {
            if (row[6] === category) {
                filteredList.push(row);
            }
        });
    }
    createPagination();
}

function filterBySearch() {
    $('#categories').children('.active').removeClass('active');
    $('#categories').children('li:contains(\'Усі\')').addClass('active');
    const filter = $('#search').val().toLowerCase();
    filteredList = [];
    dataList.forEach(row => {
        if (row[0].toString().toLowerCase().includes(filter)) {
            filteredList.push(row);
        }
    });
    createPagination();
}


// Handles UI interaction, validation, and searchable dropdown features

function initSearchableDropdown() {
  const searchInput = document.getElementById("movieSearch");
  const dropdown = document.getElementById("movieDropdown");
  const hiddenSelect = document.getElementById("movieSelect");

  if (!searchInput || !dropdown) return;

  function filterMovies(query) {
    dropdown.innerHTML = "";
    const filtered = movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
    
    if (filtered.length === 0) {
        dropdown.innerHTML = '<div class="dropdown-item">No movies found</div>';
    } else {
        filtered.forEach(movie => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            item.textContent = movie.title;
            item.onclick = () => {
                searchInput.value = movie.title;
                hiddenSelect.value = movie.title;
                dropdown.classList.remove("active");
            };
            dropdown.appendChild(item);
        });
    }
  }

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    if (query.length > 0) {
      dropdown.classList.add("active");
      filterMovies(query);
    } else {
      dropdown.classList.remove("active");
    }
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.length > 0) dropdown.classList.add("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".searchable-select")) {
      dropdown.classList.remove("active");
    }
  });
}

function goToResults() {
  const selectedMovie = document.getElementById("movieSelect").value;
  if (!selectedMovie) {
    if (window.showToast) {
       showToast("Please select a movie from the suggestions!", "error");
    } else {
       alert("Please select a movie!");
    }
    return;
  }
  localStorage.setItem("selectedMovie", selectedMovie);
  window.location.href = "result.html";
}

document.addEventListener("DOMContentLoaded", () => {
  initSearchableDropdown();
});

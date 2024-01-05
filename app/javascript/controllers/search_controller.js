import { Controller } from "@hotwired/stimulus";

export default class SearchController extends Controller {
  static targets = ["input", "suggestions"];
  timeout = null;
  childWasClicked = false;

  connect() {
    console.log("Connected?");
    document.addEventListener("click", this.handleOutsideClick.bind(this));
  }

  suggestions() {
    const query = this.inputTarget.value;
    const url = this.element.dataset.suggestionsUrl;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.requestSuggestions(query, url);
    }, 250);
  }

  requestSuggestions(query, url) {
    if (query.length === 0) {
      this.hideSuggestions();
      return;
    }
    this.showSuggestions();

    const csrfToken = document.querySelector("meta[name='csrf-token']").content;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.text())
      .then((html) => {
        document.body.insertAdjacentHTML("beforeend", html);
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
      });
  }

  handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.hideSuggestions();
    }
  }

  childClicked(event) {
    this.childWasClicked = this.element.contains(event.target);
  }

  showSuggestions() {
    this.suggestionsTarget.classList.remove("hidden");
  }

  hideSuggestions() {
    if (!this.childWasClicked) {
      this.suggestionsTarget.classList.add("hidden");
    }
    this.childWasClicked = false;
  }
}

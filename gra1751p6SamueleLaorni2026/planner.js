$(function () {
  $("#trip-tabs").tabs();

  const departure = $("#departure");
  departure.datepicker({
    minDate: 0,
    dateFormat: "mm/dd/yy",
    onSelect: function () {
      this.setCustomValidity("");
    }
  });
  departure.on("input", function () {
    this.setCustomValidity("");
  });

  const routes = {
    braies: "2 days · Lakeside walk and a night in Braies",
    seceda: "3 days · Ridgeline walks and two nights in Ortisei",
    cortina: "4 days · Three Peaks loop and three nights in Cortina"
  };
  let preferences = "";

  $("#itinerary-form").on("submit", function (event) {
    event.preventDefault();
    const field = departure[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let date;
    try {
      date = $.datepicker.parseDate("mm/dd/yy", field.value.trim());
    } catch {
      field.setCustomValidity("Enter a valid date in MM/DD/YYYY format.");
      field.reportValidity();
      return;
    }
    if (date < today) {
      field.setCustomValidity("Choose today or a future date.");
      field.reportValidity();
      return;
    }

    const [hour, minute] = $("#start").val().split(":").map(Number);
    date.setHours(hour, minute);
    const when = date.toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit"
    });
    const travelers = Number($("#travelers").val());
    const party = travelers === 1 ? "1 traveler" : travelers + " travelers";
    const summary = [routes[$("#route").val()], when, party, preferences].filter(Boolean);
    $("#itinerary-result").text(summary.join(" · "));
  });

  $("#preferences-form").on("submit", function (event) {
    event.preventDefault();
    const name = $("#trip-name").val().trim();
    const pace = $("#pace").val() + " pace";
    const guide = $("#guide").prop("checked") ? "Local guide requested" : "Self-guided";
    preferences = [name, pace, guide].filter(Boolean).join(" · ");
    $("#preferences-result").text("Applied to your trip preview · " + preferences);
    $("#itinerary-result").empty();
  });
});

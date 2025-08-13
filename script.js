function showStep(stepNumber) {
  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".progress-step");

  // Hide all steps
  steps.forEach((step) => {
    step.classList.remove("active");
  });

  // Show current step
  const currentStep = document.querySelector(`.step-${stepNumber}`);
  if (currentStep) {
    currentStep.classList.add("active");
  }

  // Update progress indicators
  progressSteps.forEach((step, index) => {
    if (index < stepNumber) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  updateSummary();
}

function updateSummary() {
  const park = document.querySelector('[name="park"]')?.value || "";
  const from = document.querySelector('[name="from"]')?.value || "";
  const to = document.querySelector('[name="to"]')?.value || "";
  const guests = document.querySelector('[name="guests"]')?.value || "";
  const equipment = document.querySelector('[name="equipment"]')?.value || "";
  const firstName = document.querySelector('[name="firstName"]')?.value || "";
  const lastName = document.querySelector('[name="lastName"]')?.value || "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculatePricing = () => {
    const baseRate = 45; // Base camping rate per night
    const equipmentFee = equipment === "RV" ? 15 : 0;
    const guestCount = parseInt(guests) || 1;
    const guestFee = guestCount > 2 ? (guestCount - 2) * 5 : 0;

    if (!from || !to) {
      return {
        subtotal: 0,
        tax: 0,
        total: "$$$",
        nights: 0,
        baseAmount: 0,
        equipmentAmount: equipmentFee,
        guestAmount: guestFee,
      };
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    const nights = Math.max(
      1,
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    );

    const baseAmount = baseRate * nights;
    const subtotal = baseAmount + equipmentFee + guestFee;
    const taxRate = 0.13; // 13% HST
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: `$${total.toFixed(2)}`,
      nights: nights,
      baseAmount: baseAmount.toFixed(2),
      equipmentAmount: equipmentFee.toFixed(2),
      guestAmount: guestFee.toFixed(2),
    };
  };

  // Update summary name
  const summaryNames = document.querySelectorAll(".summary-name");
  summaryNames.forEach((el) => {
    if (firstName || lastName) {
      el.textContent = `${firstName} ${lastName}`.trim();
    } else {
      el.textContent = "Name";
    }
  });

  // Update summary location
  const summaryLocations = document.querySelectorAll(".summary-location span");
  summaryLocations.forEach((el) => {
    el.textContent = park || "Location";
  });

  // Update info items with pricing breakdown
  const updateInfoLabels = () => {
    const pricing = calculatePricing();
    const infoItems = document.querySelectorAll(".info-item");
    const labels = [
      `From: ${formatDate(from) || ""}`,
      `To: ${formatDate(to) || ""}`,
      `Guests: ${guests || ""}`,
      `Equipment: ${equipment || ""}`,
      pricing.subtotal > 0 ? `$${pricing.subtotal}` : "$$",
      pricing.tax > 0 ? `$${pricing.tax}` : "",
      "Extras:",
    ];

    infoItems.forEach((item, index) => {
      if (index < labels.length) {
        const label = item.querySelector(".info-label");
        if (label) {
          label.textContent = labels[index];
        }
      }
    });
  };

  updateInfoLabels();

  // Update total
  const pricing = calculatePricing();
  const totalAmounts = document.querySelectorAll(".total-amount");
  totalAmounts.forEach((el) => {
    el.textContent = pricing.total;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showStep(1);

  const step1Form = document.getElementById("step1-form");
  const step2Form = document.getElementById("step2-form");
  const step3Form = document.getElementById("step3-form");

  if (step1Form) {
    step1Form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (step1Form.checkValidity()) {
        updateSummary();
        showStep(2);
      } else {
        step1Form.reportValidity();
      }
    });
  }

  if (step2Form) {
    step2Form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (step2Form.checkValidity()) {
        updateSummary();
        showStep(3);
      } else {
        step2Form.reportValidity();
      }
    });
  }

  if (step3Form) {
    step3Form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (step3Form.checkValidity()) {
        updateSummary();
        alert("✅ Payment confirmed! Your reservation is complete.");
        step1Form.reset();
        step2Form.reset();
        step3Form.reset();
        showStep(1);
      } else {
        step3Form.reportValidity();
      }
    });
  }

  const paymentTabs = document.querySelectorAll(".payment-tab");
  paymentTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      paymentTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  const formInputs = document.querySelectorAll("input, select, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("change", updateSummary);
    input.addEventListener("input", updateSummary);
  });

  updateSummary();
});

---
layout: default
title: Protein
---

# Protein Analysis

This page displays a digital clock with the current time. The clock updates every second.

```html
<div id="clock" style="font-family: Arial, sans-serif; font-size: 24px; text-align: center; margin-top: 20px;"></div>

<script>
  function updateClock() {
    const now = new Date();
    const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ');
    document.getElementById('clock').textContent = formattedTime;
  }

  // Update the clock every second
  setInterval(updateClock, 1000);
  updateClock(); // Initial call to display the current time immediately
</script>
```

# Invoice-Generator


A web-based application for generating professional GST invoices dynamically. Built using **HTML**, **CSS**, and **JavaScript**, this tool allows users to input buyer and product details, automatically calculates taxes, and renders a print-ready invoice.

---

## 🚀 Features

* Add multiple products with HSN, quantity, unit, and rate
* Auto-calculate total amount, tax (IGST / SGST + CGST), and grand total
* GST-compliant invoice format with amount in words
* Save buyer details locally and auto-fill on future use
* Supports transport and vehicle info
* Generates styled printable invoice in-browser
* Added Print functionality to print the generated invoice.

---

## 📂 File Structure

```
📁 Dynamic-Invoice-Generator/
├── index.html      # Main HTML layout
├── style.css       # Styling for layout and invoice format
├── script.js       # Logic for data handling and invoice generation
```

---

## 💻 Technologies Used

* HTML5
* CSS3 (Flexbox, responsive styles)
* JavaScript (DOM manipulation, local storage, invoice rendering)

---

## 📦 How to Use

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dynamic-invoice-generator.git
   cd dynamic-invoice-generator
   ```

2. Open `index.html` in any modern browser:

   ```bash
   open index.html
   ```

3. Fill in:

   * Buyer details (auto-suggest enabled from previous entries)
   * Product items (multiple rows supported)
   * Tax type and transporter details

4. Click **Generate Invoice** to view the formatted invoice.

5. You can click **Print Invoice** to print or export as PDF.

---

## 🖼 Preview

> ![image](https://github.com/user-attachments/assets/4e044a7a-5a97-4f95-8f6b-e873cc172a31)


---

## 📌 To-Do / Improvements


* [ ] Export and import buyer/product data
* [ ] Mobile-friendly optimizations

---
 *If you found this project helpful, consider giving it a star!*

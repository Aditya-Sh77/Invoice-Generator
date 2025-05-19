let itemCount = 0;

// Add event listener to the generate invoice button
document.getElementById("generateInvoice").addEventListener("click", () => {
  // Clear the invoice preview area
  document.getElementById("invoicePreview").innerHTML = "";
  // Generate the invoice
  generateInvoice();
});

// Function to add a new item entry
function addItem() {
  itemCount++;
  const container = document.getElementById('items');
  const html = `
    <div class="item-row" id="item${itemCount}">
      <label>Description</label>
      <input type="text" class="desc">
      <label>HSN Code</label>
      <input type="text" class="hsn">
      <label>Quantity</label>
      <input type="number" class="qty" value="1">
      <label>Unit</label>
      <input type="text" class="unit" value="NOS">
      <label>Rate (₹)</label>
      <input type="number" class="rate" value="0">
      <button class="remove-btn" onclick="removeItem('item${itemCount}')">Remove</button>
      <hr>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
}

// Function to remove an item entry
function removeItem(id) {
  const elem = document.getElementById(id);
  if (elem) elem.remove();
}

// Function to generate the invoice
function generateInvoice() {

  // Gather buyer and invoice details
  const buyerName = document.getElementById('buyerName').value;
  const buyerAddress = document.getElementById('buyerAddress').value;
  const shippingAddress = document.getElementById('shippingAddress').value;
  const invoiceNo = document.getElementById('invoiceNo').value;
  const invoiceDate = document.getElementById('invoiceDate').value;
  const poNo = document.getElementById('poNo').value;
  const poDate = document.getElementById('poDate').value;
  const taxType = document.getElementById('taxType').value;
  const trName = document.getElementById('transportName').value;
  const trID = document.getElementById('transportID').value.toUpperCase();
  const vehicleNo = document.getElementById('vehicleNo').value.toUpperCase();
  const buyerGSTIN = document.getElementById('buyerGST').value.toUpperCase();

  // Store buyer details in local storage if not already saved
  const buyer = { name: buyerName, address: buyerAddress, gstin: buyerGSTIN };
  let savedBuyers = JSON.parse(localStorage.getItem('buyers')) || [];
  const exists = savedBuyers.find(b => b.name.toLowerCase() === buyerName.toLowerCase());
  if (!exists) {
    savedBuyers.push(buyer);
    localStorage.setItem('buyers', JSON.stringify(savedBuyers));
  }

  let rows = '';
  let total = 0;

  // Gather product details and calculate total amount
  const descriptions = document.querySelectorAll('.desc');
  const hsns = document.querySelectorAll('.hsn');
  const qtys = document.querySelectorAll('.qty');
  const units = document.querySelectorAll('.unit');
  const rates = document.querySelectorAll('.rate');

  for (let i = 0; i < descriptions.length; i++) {
    const desc = descriptions[i].value;
    const hsn = hsns[i].value;
    const qty = parseFloat(qtys[i].value);
    const unit = units[i].value;
    const rate = parseFloat(rates[i].value);
    const amount = qty * rate;
    total += amount;
    rows += `<tr>
      <td>${i + 1}</td>
      <td>${desc}</td>
      <td>${hsn}</td>
      <td>${qty}</td>
      <td>${unit}</td>
      <td>₹ ${rate.toFixed(2)}</td>
      <td>₹ ${amount.toFixed(2)}</td>
    </tr>`;
  }

  // Calculate tax based on the selected tax type
  let tax = 0;
  let taxLabel = '';
  if (taxType === 'IGST') {
    tax = total * 0.12;
    taxLabel = `<tr><td colspan="6" class="right bold">IGST @12%</td><td>₹ ${tax.toFixed(2)}</td></tr>`;
  } else {
    const half = (total * 0.18) / 2;
    taxLabel = `<tr><td colspan="6" class="right bold">SGST @9%</td><td>₹ ${half.toFixed(2)}</td></tr>
                <tr><td colspan="6" class="right bold">CGST @9%</td><td>₹ ${half.toFixed(2)}</td></tr>`;
    tax = half * 2;
  }

  // Calculate grand total and convert amount to words
  const grandTotal = total + tax;
  const rupees = Math.floor(grandTotal);
  const paise = Math.round((grandTotal - rupees) * 100);
  const amountWords = `${numberToWords(rupees)} Rupees${paise > 0 ? ' and ' + numberToWords(paise) + ' Paise' : ''}`;

  // Generate the invoice HTML
  const html = `
    <div id="invoice">
      <h3 id="invoiceTitle">Tax Invoice</h3>
      <p id="company"><strong> SAI BELTING </strong><br>
      G-58, Site - B, UPSIDC Industrial Area, <br>
      Surajpur, Greater Noida (U.P.) - 201306 <br>
      <br>
      </p>
      <p>Phone: +91 9818522978, Email: saibelting35@gmail.com</p>
      <section id="customer">
      <p id= "buyer"><strong>M/S: </strong> ${buyerName}<br><strong>Billing Address: </strong>${buyerAddress}<br><strong>Shipping Address: </strong>${shippingAddress}<br><strong>GSTIN:</strong> ${buyerGSTIN}</p>
      <p id="invR"><strong>Invoice No:</strong> ${invoiceNo} <br> <strong>Invoice Date:</strong> ${invoiceDate}<br>
         <strong>PO No:</strong> ${poNo} <br> <strong>PO Date:</strong> ${poDate}</p>
      </section>   
      <table>
        <tr><th>S.No.</th><th>Description</th><th>HSN Code</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th></tr>
        ${rows}
        <tr><td colspan="6" class="right bold">Total</td><td>₹ ${total.toFixed(2)}</td></tr>
        ${taxLabel}
        <tr><td colspan="6" class="right bold">Grand Total</td><td>₹ ${grandTotal.toFixed(2)}</td></tr>
      </table>

      <section class="transporter">
        <p><strong>Transporter:</strong> ${trName} <br><br> <strong>Transporter ID:</strong> ${trID} <br><br> <strong>Vehicle No.:</strong> ${vehicleNo}</p>
      </section>

      <p id="terms"><strong>Terms & Conditions:</strong><br>
      1. Goods once sold will not be taken back.<br>
      2. Interest @ 18% per annum will be charged if the payment is not made within the stipulated time.<br>
      3. Subject to G.B. Nagar jurisdiction only.</p>

      <p id="bank"><strong>Bank Details:</strong><br>
      Bank: Punjab National Bank<br>
      Branch: Sector-12, Noida<br>
      Account No.: 468002100001440<br>
      IFSC Code: PUNB0466000</p>

      <p><strong>Amount in Words:</strong> ${amountWords} Only</p>

      <p id="sign"><strong>For SAI BELTING</strong><br><br>(Authorized Signatory)</p>
    </div>
  `;

  // Append the generated invoice HTML to the preview area
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '40px';
  wrapper.innerHTML = html;
  document.getElementById('invoicePreview').appendChild(wrapper);
}

// Function to print the invoice
// function printInvoice() {
//   const invoice = document.getElementById('invoicePreview').innerHTML;
//   const printWindow = window.open('', '', 'width=800,height=900');
//   printWindow.document.write('<html><head><title>Invoice</title></head><body>');
//   printWindow.document.write(invoice);
//   printWindow.document.write('</body></html>');
//   printWindow.document.close();
//   printWindow.print();
// }

// Function to convert numbers to words
function numberToWords(num) {
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
             "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function twoDigitWords(n) {
    n = Number(n);
    if (n === 0) return '';
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
  }

  function inWords(num) {
    if (num === 0) return 'Zero';
    if (num > 999999999) return 'Overflow';

    let str = '';
    const n = ('000000000' + num).slice(-9);
    const crore = parseInt(n.slice(0, 2), 10);
    const lakh = parseInt(n.slice(2, 4), 10);
    const thousand = parseInt(n.slice(4, 6), 10);
    const hundred = parseInt(n.slice(6, 7), 10);
    const rest = parseInt(n.slice(7, 9), 10);

    if (crore) str += twoDigitWords(crore) + ' Crore ';
    if (lakh) str += twoDigitWords(lakh) + ' Lakh ';
    if (thousand) str += twoDigitWords(thousand) + ' Thousand ';
    if (hundred) str += a[hundred] + ' Hundred ';
    if (rest) str += (str.trim() !== '' ? 'and ' : '') + twoDigitWords(rest) + ' ';

    return str.trim();
  }

  return inWords(Math.floor(num));
}

// Initialize the page by adding an item and populating buyer suggestions
window.onload = function () {
  addItem();
  populateBuyerSuggestions();
};

// Function to populate buyer suggestions from local storage
function populateBuyerSuggestions() {
  const dataList = document.getElementById('buyerSuggestions');
  if (!dataList) return;
  dataList.innerHTML = '';

  const savedBuyers = JSON.parse(localStorage.getItem('buyers')) || [];
  savedBuyers.forEach(buyer => {
    const option = document.createElement('option');
    option.value = buyer.name;
    dataList.appendChild(option);
  });
}

// Auto-fill buyer details if a saved buyer name is entered
document.getElementById('buyerName').addEventListener('input', function () {
  const entered = this.value.toLowerCase();
  const savedBuyers = JSON.parse(localStorage.getItem('buyers')) || [];

  const match = savedBuyers.find(b => b.name.toLowerCase() === entered);
  if (match) {
    document.getElementById('buyerAddress').value = match.address;
    document.getElementById('buyerGST').value = match.gstin;
  }
});


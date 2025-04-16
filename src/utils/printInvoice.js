export function printInvoice(billData, companyUser, bill_number, tel, nit, address) {
    if (!billData) {
        console.error("No hay datos de factura para imprimir.");
        return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
        <html>
        <head>
            <style>
                @media print {
                    body { font-family: Arial, sans-serif; text-align: center; }
                    .ticket { width: 80mm; padding: 5px; font-size: 14px; }
                    .item { display: flex; justify-content: space-between; }
                    h2 { font-size: 18px; }
                    h3 { font-size: 16px; font-weight: bold; }
                    hr { border: none; border-top: 1px dashed black; margin: 5px 0; }
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <h2>${companyUser}</h2>
                <p>Factura de Venta</p>
                <p>Numero de Factura: ${bill_number}
                <p>Cliente: ${billData.client_name}</p>
                <p>Teléfono: ${billData.client_phone}</p>
                <hr>
                ${billData.phones.map(phone => `
                    <div class="item">
                        <span>${phone.brand_name} ${phone.device}</span>
                        <span>$${phone.individual_price}</span>
                        <br>
                        <span>Detalles.: ${phone.details}</span>
                    </div>
                `).join('')}
                <hr>
                <h3>Total: $${billData.total_price}</h3>
                <p>¡Gracias por su compra!</p>
                <p>Teléfono de contacto: ${tel}</p>
                <p>NIT: ${nit}</p>
                <p>Dirección: ${address}</p>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => { window.close(); }, 500);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

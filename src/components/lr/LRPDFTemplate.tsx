import { forwardRef } from "react";

interface LRPDFTemplateProps {
  data: any;
  logoUrl?: string;
}

const LRPDFTemplate = forwardRef<HTMLDivElement, LRPDFTemplateProps>(({ data, logoUrl }, ref) => {
  return (
    <div ref={ref} className="bg-white p-8" style={{ width: "210mm", minHeight: "297mm" }}>
      {/* Header */}
      <div className="border-4 border-black p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            {logoUrl && (
              <img src={logoUrl} alt="SSK Logo" className="h-16 w-16 object-contain" />
            )}
            <div>
              <h1 className="text-4xl font-bold text-red-600" style={{ fontFamily: 'Arial, sans-serif' }}>
                SSK INDIA LOGISTICS
              </h1>
              <p className="text-sm font-semibold">(Fleet Owner & Contractor)</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">Jai Dada Udmiram Ki</p>
            <p className="font-semibold">SUBJECT TO DELHI JURISDICTION</p>
            <p>7834819005</p>
            <p>8929920007</p>
            <p>7600026311</p>
            <p>9619905027</p>
          </div>
        </div>

        <p className="text-xs text-center">
          Shop No. 362-A/2, Sataya Puram Colony, Jharoda Border, Near Ashram, New Delhi-110072
        </p>
        <p className="text-xs text-center mb-4">
          Mail : ssindialogitics@gmail.com, Web : www.indialogistics.com
        </p>

        {/* Available At / Caution / At Owners Risks */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="border-2 border-black p-2">
            <p className="font-bold mb-1">Available At :</p>
            <p className="font-semibold">AHMEDABAD</p>
            <p className="font-semibold">SURAT</p>
            <p className="font-semibold">VAPI</p>
            <p className="font-semibold">MUMBAI</p>
            <p className="font-semibold">PUNE</p>
          </div>
          <div className="border-2 border-black p-2">
            <p className="font-bold mb-1">CAUTION</p>
            <p className="text-xs">This Consignment Will Not Be Detained Divorted, Re-Routed Or Re-Booked Without Consignee Bank Written Permission Will be Delivered At the Destination.</p>
            <p className="font-bold mt-2">NOTICE</p>
            <p className="text-xs">This consignment covered in this set of special lorry receipt shall be stored at the destination under the control of the transport operator & shall be delivered to or to the order of the Consignee Bank whose name is mentioned in the lorry receipt. It will under no circumstances be delivered to anyone without the written authority form the consignee Bank or its order endorsed on the Consignee Copy or on a separated Letter or Authority.</p>
          </div>
          <div className="border-2 border-black p-2 space-y-2">
            <div>
              <p className="font-bold">AT OWNERS RISKS</p>
              <p>Pan No. : CMFPS3661A</p>
              <p className="text-red-600 font-bold">GST No. : 07CMFPS3661A1Z6</p>
            </div>
            <div>
              <p className="font-bold">INSURANCE</p>
              <p className="text-xs">The Customer Has Started That He Has Not Insured The Consignment Policy No ________ Date________ Amount________Risk________</p>
            </div>
            <div>
              <p className="font-bold">SCHEDULE OF DEMURRAGE CHARGES</p>
              <p className="text-xs">Demmurrage Chargeable After 5 days Arrival Of Goods Rs. 7/per Qtl.Per Day On Weight Charged</p>
            </div>
            <div>
              <p className="font-bold">Address Of Delivery :</p>
              <p className="text-xs">{data?.address_of_delivery || ''}</p>
            </div>
          </div>
        </div>

        {/* Consignor GST No */}
        <div className="mb-4">
          <p className="font-bold">Consignor GST No. : {data?.consignor_gst || ''}</p>
        </div>

        {/* Vehicle and C NOTE */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm">Vehicle No. :</p>
            <p className="text-2xl font-bold">{data?.truck_no || ''}</p>
          </div>
          <div>
            <p className="text-sm">C NOTE No. : <span className="text-xl font-bold">{data?.lr_no || ''}</span></p>
          </div>
        </div>

        {/* Consignor and Consignee */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-bold">Consignor :</p>
            <p className="font-semibold">{data?.consignor_name || ''}</p>
          </div>
          <div>
            <p className="font-bold">Consignee :</p>
            <p className="font-semibold">{data?.consignee_name || ''}</p>
          </div>
        </div>

        {/* Date, From, To */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="font-bold">DATE :</p>
            <p>{data?.date ? new Date(data.date).toLocaleDateString('en-GB') : ''}</p>
          </div>
          <div>
            <p className="font-bold">FROM :</p>
            <p>{data?.from_place || ''}</p>
          </div>
          <div>
            <p className="font-bold">TO :</p>
            <p>{data?.to_place || ''}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-2 border-black mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2">Packages</th>
              <th className="border border-black p-2">Description</th>
              <th className="border border-black p-2 w-32">Weight</th>
              <th className="border border-black p-2 w-24">Rate</th>
              <th className="border border-black p-2 w-32">Amount</th>
              <th className="border border-black p-2 w-40">Any Other Information<br/>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 text-center" rowSpan={3}>
                {data?.items && JSON.parse(data.items).reduce((sum: number, item: any) => sum + (parseInt(item.pcs) || 0), 0)}
              </td>
              <td className="border border-black p-2" rowSpan={3}>
                {data?.items && JSON.parse(data.items).map((item: any, idx: number) => (
                  <div key={idx}>{item.description}</div>
                ))}
              </td>
              <td className="border border-black p-2">
                <div className="grid grid-cols-2">
                  <span className="font-semibold">Actual</span>
                  <span className="font-semibold">Charged</span>
                </div>
              </td>
              <td className="border border-black p-2 text-center" rowSpan={3}>
                Hamail<br/>
                Sur.CH.<br/>
                St.CH.<br/>
                Collection CH.<br/>
                D.Dty CH.
              </td>
              <td className="border border-black p-2" rowSpan={3}></td>
              <td className="border border-black p-2 text-center" rowSpan={3}>
                <p className="font-bold">To PAY Rs. :</p>
                <br/><br/>
                <p className="font-bold">Paid RS. :</p>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                <div className="grid grid-cols-2">
                  <span>{data?.actual_weight_mt || ''}</span>
                  <span>{data?.weight_mt || ''}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                <div className="text-center font-semibold">Mark</div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center" colSpan={2}>
                <div className="text-xs">
                  <p>Invoice No.: {data?.invoice || ''} &nbsp;&nbsp; Date: {data?.invoice_date ? new Date(data.invoice_date).toLocaleDateString('en-GB') : ''}</p>
                  <p className="font-bold">GST NO. : {data?.consignor_gst || ''}</p>
                </div>
              </td>
              <td className="border border-black p-2" colSpan={2} rowSpan={2}></td>
              <td className="border border-black p-2 text-center">Other CH.</td>
              <td className="border border-black p-2" rowSpan={2}></td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-xs" colSpan={2}>
                Endorsement Its Is Intended To use Consignee Copy Of the Set For The Purpose Of Borrowing From The Consignee Bank
              </td>
              <td className="border border-black p-2 text-center">Risk CH.</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-xs" colSpan={4}>
                The Court In Delhi Alone Shall Have Jurisdiction In Respect Of The Claims And Matters Arising Under The Consignment Or Of the Claims And Matter Arising Under The Goods Entrusted For Transport
              </td>
              <td className="border border-black p-2 text-center font-bold">Total</td>
              <td className="border border-black p-2"></td>
            </tr>
          </tbody>
        </table>

        {/* GST Payable By and Value */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="font-bold">Value :</p>
            <p className="text-lg">{data?.freight || ''}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">GST PAYABLE BY</p>
          </div>
          <div className="text-right">
            <p className="font-bold">For SSK INDIA LOGISTICS</p>
            <div className="mt-8">
              <p className="italic">Auth. Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

LRPDFTemplate.displayName = "LRPDFTemplate";

export default LRPDFTemplate;

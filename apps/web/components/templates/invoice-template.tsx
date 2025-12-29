import React from 'react';
import { Invoice, InvoiceItem } from '../../lib/types/invoice';
import Image from 'next/image';
import { OrganizationBranding } from '../../lib/types/organization-settings';
import { formatCurrency } from '../../lib/utils';

interface InvoiceTemplateProps {
    invoice: Invoice;
    branding: OrganizationBranding;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, branding }) => {
    return (
        <div
            id="invoice-content"
            className="bg-white text-zinc-900 p-12 w-[800px] min-h-[1100px] flex flex-col shadow-2xl relative overflow-hidden font-sans"
        >
            {/* Header with Black Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-[#1a1a1a] flex items-center px-12 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#ea580c] flex items-center justify-center rounded-lg">
                        {branding.logo ? (
                            <Image src={branding.logo} alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" unoptimized />
                        ) : (
                            <span className="text-2xl font-black italic">ID</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-widest">{branding.companyName}</h1>
                    </div>
                </div>

                <div className="ml-auto flex gap-8 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    <div className="text-right">
                        <p className="text-white mb-1">Postal Address</p>
                        <p>{branding.address.street}</p>
                        <p>{branding.address.city}, {branding.address.state}</p>
                    </div>
                    <div className="text-right border-l border-zinc-700 pl-8">
                        <p className="text-white mb-1">Contact Details</p>
                        <p>{branding.phone}</p>
                        <p>{branding.email}</p>
                    </div>
                </div>
            </div>

            {/* Styled Banner Transition */}
            <div className="mt-32 h-16 relative">
                <div className="absolute top-0 right-0 w-2/3 h-10 bg-white" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
                <div className="absolute top-0 right-0 w-[64%] h-1 bg-[#ea580c] mt-2"></div>
                <div className="absolute top-0 left-0 w-full flex justify-between items-center px-12 pt-4">
                    {invoice.status === 'paid' && (
                        <div className="bg-green-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg animate-in zoom-in duration-500">
                            Payment Received • Paid
                        </div>
                    )}
                    <h2 className="text-4xl font-black text-[#ea580c] uppercase tracking-tighter ml-auto">Invoice</h2>
                </div>
            </div>

            {/* Paid Watermark */}
            {invoice.status === 'paid' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] pointer-events-none opacity-[0.03] select-none z-0">
                    <p className="text-[200px] font-black uppercase tracking-[0.1em]">PAID</p>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-12 grid grid-cols-2 gap-12 px-4">
                <div>
                    <h3 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-4">Invoice To :</h3>
                    <p className="font-black text-xl mb-2">{invoice.clientName}</p>
                    <div className="space-y-1 text-sm text-zinc-600 font-medium">
                        {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
                        <p>{invoice.clientEmail}</p>
                        {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                    </div>
                </div>

                <div className="text-right">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-1">Info :</h3>
                        <p className="text-sm font-medium text-zinc-600">Invoice Number : <span className="text-zinc-900 font-bold">{invoice.invoiceNumber}</span></p>
                        <p className="text-sm font-medium text-zinc-600">Date : <span className="text-zinc-900 font-bold">{new Date(invoice.issueDate).toLocaleDateString()}</span></p>
                    </div>

                    <div>
                        <h3 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-1">Payment Method :</h3>
                        <p className="text-sm font-medium text-zinc-600">Method : <span className="text-zinc-900 font-bold">{invoice.paymentMethod || (invoice.status === 'paid' ? '-' : (branding.paymentMethods?.[0]?.type || 'Bank Transfer'))}</span></p>
                        <p className="text-sm font-medium text-zinc-600">Details : <span className="text-zinc-900 font-bold">{invoice.paymentDetails || (invoice.status === 'paid' ? '-' : (branding.paymentMethods?.[0]?.accountNumber || '-'))}</span></p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="mt-16 px-4 flex-grow">
                <div className="rounded-[40px] overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#ea580c] text-white">
                            <tr>
                                <th className="py-5 px-10 text-left uppercase tracking-widest text-xs font-black">Description</th>
                                <th className="py-5 px-6 text-center uppercase tracking-widest text-xs font-black">Qty</th>
                                <th className="py-5 px-6 text-center uppercase tracking-widest text-xs font-black">Price</th>
                                <th className="py-5 px-10 text-right uppercase tracking-widest text-xs font-black">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-zinc-50">
                            {invoice.items.map((item: InvoiceItem, index: number) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-zinc-100/50' : 'bg-white'}>
                                    <td className="py-4 px-10 text-sm font-bold text-zinc-700">{item.description}</td>
                                    <td className="py-4 px-6 text-center text-sm font-bold text-zinc-700">{item.quantity}</td>
                                    <td className="py-4 px-6 text-center text-sm font-bold text-zinc-700">{formatCurrency(item.rate)}</td>
                                    <td className="py-4 px-10 text-right text-sm font-black text-zinc-900">{formatCurrency(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="mt-8 flex justify-end px-4">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold text-zinc-500">
                            <span className="uppercase tracking-widest text-xs">Subtotal</span>
                            <span className="text-zinc-900">{formatCurrency(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-zinc-500">
                            <span className="uppercase tracking-widest">Tax ({invoice.taxRate || 10}%)</span>
                            <span className="text-zinc-900">{formatCurrency(invoice.tax)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#ea580c] text-white p-4 rounded-full mt-2">
                            <span className="uppercase tracking-widest font-black text-xs">Total</span>
                            <span className="font-black text-xl">{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="mt-20 border-t-4 border-[#ea580c] pt-12 pb-8 px-4">
                <div>
                    <h4 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-2">Terms & Condition</h4>
                    <p className="text-[10px] leading-relaxed text-zinc-500 font-bold uppercase tracking-wider max-w-2xl">
                        {invoice.terms || branding.defaultInvoiceTerms}
                    </p>
                </div>

                <div className="mt-12">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">Thank You</p>
                </div>
            </div>

            {/* Bottom Orange Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#ea580c]"></div>
        </div>
    );
};

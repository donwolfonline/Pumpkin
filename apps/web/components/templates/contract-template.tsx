import React from 'react';
import { formatCurrency } from '../../lib/utils';
import { Signature, PaymentSchedule, Contract } from '../../lib/types/contract';
import { OrganizationBranding } from '../../lib/types/organization-settings';
import NextImage from 'next/image';

interface ContractTemplateProps {
    contract: Contract;
    branding: OrganizationBranding;
}

export const ContractTemplate: React.FC<ContractTemplateProps> = ({ contract, branding }) => {
    return (
        <div
            id="contract-content"
            className="bg-white text-zinc-900 p-6 sm:p-12 max-w-[800px] w-full min-h-[600px] sm:min-h-[1100px] mx-auto flex flex-col shadow-2xl relative overflow-hidden font-sans"
        >
            {/* Header with Black Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-[#1a1a1a] flex flex-col sm:flex-row items-center sm:items-center px-6 sm:px-12 text-white py-4 sm:py-0">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#ea580c] flex items-center justify-center rounded-lg shrink-0">
                        {branding.logo ? (
                            <NextImage src={branding.logo} alt="Logo" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" unoptimized />
                        ) : (
                            <span className="text-xl sm:text-2xl font-black italic">ID</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-xl font-black uppercase tracking-widest">{branding.companyName}</h1>
                    </div>
                </div>

                <div className="hidden sm:flex ml-auto gap-8 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    <div className="text-right">
                        <p className="text-white mb-1">Address</p>
                        <p>{branding.address.street}</p>
                        <p>{branding.address.city}, {branding.address.state}</p>
                    </div>
                    <div className="text-right border-l border-zinc-700 pl-8">
                        <p className="text-white mb-1">Contact</p>
                        <p>{branding.phone}</p>
                        <p>{branding.email}</p>
                    </div>
                </div>
            </div>

            {/* Styled Banner Transition */}
            <div className="mt-32 h-16 relative">
                <div className="absolute top-0 right-0 w-2/3 h-10 bg-white" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
                <div className="absolute top-0 right-0 w-[64%] h-1 bg-[#ea580c] mt-2"></div>
                <div className="absolute top-0 left-0 w-full flex justify-end pr-12 pt-4">
                    <h2 className="text-4xl font-black text-[#ea580c] uppercase tracking-tighter">Contract</h2>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 px-4">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-[10px] font-black text-[#ea580c] uppercase tracking-widest mb-4">Parties :</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[8px] sm:text-[10px] font-black uppercase text-zinc-400 mb-1">Service Provider</p>
                                <p className="font-black text-base sm:text-lg leading-tight">{branding.companyName}</p>
                            </div>
                            <div>
                                <p className="text-[8px] sm:text-[10px] font-black uppercase text-zinc-400 mb-1">Client</p>
                                <p className="font-black text-base sm:text-lg leading-tight">{contract.clientName}</p>
                                {contract.clientCompany && <p className="text-xs sm:text-sm font-bold text-zinc-600">{contract.clientCompany}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm:text-right">
                    <div className="mb-6 space-y-1">
                        <h3 className="text-[10px] font-black text-[#ea580c] uppercase tracking-widest mb-1 sm:mb-4">Agreement Info :</h3>
                        <p className="text-xs sm:text-sm font-medium text-zinc-600">Contract # : <span className="text-zinc-900 font-bold">{contract.contractNumber}</span></p>
                        <p className="text-xs sm:text-sm font-medium text-zinc-600">Start Date : <span className="text-zinc-900 font-bold">{new Date(contract.startDate).toLocaleDateString()}</span></p>
                        <p className="text-xs sm:text-sm font-medium text-zinc-600">End Date : <span className="text-zinc-900 font-bold">{new Date(contract.endDate).toLocaleDateString()}</span></p>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black text-[#ea580c] uppercase tracking-widest mb-1">Status :</h3>
                        <p className="text-xs sm:text-sm font-black text-green-600 uppercase italic tracking-widest">{contract.status}</p>
                    </div>
                </div>
            </div>

            {/* Contract Terms Section */}
            <div className="mt-12 px-4 flex-grow prose prose-zinc max-w-none">
                <h3 className="text-lg font-black text-[#ea580c] uppercase tracking-widest mb-4 border-b-2 border-zinc-100 pb-2">Master Services Agreement</h3>
                <div className="text-zinc-700 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                    {contract.terms || "This Master Services Agreement ('Agreement') is entered into between " + branding.companyName + " and " + contract.clientName + ". This agreement outlines the professional services and deliverables to be provided as part of the " + contract.title + " project."}
                </div>

                {contract.paymentSchedule.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-lg font-black text-[#ea580c] uppercase tracking-widest mb-4 border-b-2 border-zinc-100 pb-2">Payment Schedule</h3>
                        <div className="space-y-3">
                            {contract.paymentSchedule.map((milestone: PaymentSchedule, idx: number) => (
                                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-50 p-4 rounded-xl border border-zinc-100 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-zinc-200 flex items-center justify-center text-[8px] sm:text-[10px] font-black shrink-0">{idx + 1}</div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-zinc-900">{milestone.description}</p>
                                            <p className="text-[8px] sm:text-[10px] font-black uppercase text-zinc-400">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="sm:text-right w-full sm:w-auto flex justify-between sm:block border-t sm:border-t-0 border-zinc-100 pt-2 sm:pt-0">
                                        <p className="text-base sm:text-lg font-black text-[#ea580c]">{formatCurrency(milestone.amount)}</p>
                                        <p className="text-[8px] sm:text-[10px] font-black uppercase text-zinc-400">{milestone.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Signature Section */}
            <div className="mt-20 px-4">
                <h3 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-8">Signatures</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-20">
                    <div className="space-y-4">
                        <div className="h-16 border-b-2 border-zinc-200 flex items-end pb-2">
                            {(() => {
                                const signature = contract.signatures.find((s: Signature) => s.party === 'company');
                                if (!signature) return null;

                                // Show image signature if available, otherwise show name in italic
                                if (signature.signatureData) {
                                    return <NextImage src={signature.signatureData} alt="Signature" width={150} height={50} className="h-12 w-auto object-contain" unoptimized />;
                                } else if (signature.name) {
                                    return <p className="text-2xl font-medium italic text-zinc-900">{signature.name}</p>;
                                }
                                return null;
                            })()}
                        </div>
                        <div>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#ea580c]">Authorized Representative</p>
                            <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">{branding.companyName}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-16 border-b-2 border-zinc-200 flex items-end pb-2">
                            {(() => {
                                const signature = contract.signatures.find((s: Signature) => s.party === 'client');
                                if (!signature) return null;

                                // Show image signature if available, otherwise show name in italic
                                if (signature.signatureData) {
                                    return <NextImage src={signature.signatureData} alt="Signature" width={150} height={50} className="h-12 w-auto object-contain" unoptimized />;
                                } else if (signature.name) {
                                    return <p className="text-2xl font-medium italic text-zinc-900">{signature.name}</p>;
                                }
                                return null;
                            })()}
                        </div>
                        <div>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#ea580c]">Client Authorized Signatory</p>
                            <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">{contract.clientName}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="mt-20 border-t-4 border-[#ea580c] pt-12 pb-8 px-4">
                <div>
                    <h4 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-2">Legal Disclaimer</h4>
                    <p className="text-[10px] leading-relaxed text-zinc-500 font-bold uppercase tracking-wider max-w-2xl">
                        {branding.defaultContractTerms || 'This document is a legally binding agreement. Any disputes arising from this agreement shall be governed by the laws of the jurisdiction where Pumpkin CRM is registered.'}
                    </p>
                </div>

                <div className="mt-8 flex justify-between items-end">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">Pumpkin Legal Suite</p>
                    <p className="text-[8px] font-bold text-zinc-300 uppercase">Document Hash: {contract.id.replace(/-/g, '').slice(0, 16).toUpperCase()}</p>
                </div>
            </div>

            {/* Bottom Orange Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#ea580c]"></div>
        </div>
    );
};

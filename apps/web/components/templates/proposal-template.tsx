import React from 'react';
import { Proposal } from '@/lib/types/proposal';
import Image from 'next/image';
import { OrganizationBranding } from '@/lib/types/organization-settings';
import { formatCurrency } from '@/lib/utils';

interface ProposalTemplateProps {
    proposal: Proposal;
    branding: OrganizationBranding;
}

export const ProposalTemplate: React.FC<ProposalTemplateProps> = ({ proposal, branding }) => {
    return (
        <div
            id="proposal-content"
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
                <div className="absolute top-0 left-0 w-full flex justify-end pr-12 pt-4">
                    <h2 className="text-4xl font-black text-[#ea580c] uppercase tracking-tighter">Proposal</h2>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-12 grid grid-cols-2 gap-12 px-4">
                <div>
                    <h3 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-4">Proposed To :</h3>
                    <p className="font-black text-xl mb-2">{proposal.clientName && proposal.clientName !== 'Unknown Client' ? proposal.clientName : 'Valued Client'}</p>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Project: {proposal.title}</p>
                    <div className="space-y-1 text-sm text-zinc-600 font-medium">
                        <p>ID: {proposal.id.split('-')[0].toUpperCase()}</p>
                        <p>Status: {proposal.status.toUpperCase()}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-1">Details :</h3>
                        <p className="text-sm font-medium text-zinc-600">Date Issued : <span className="text-zinc-900 font-bold">{new Date(proposal.createdAt || '').toLocaleDateString()}</span></p>
                        {proposal.validUntil && (
                            <p className="text-sm font-medium text-zinc-600">Valid Until : <span className="text-zinc-900 font-bold">{new Date(proposal.validUntil).toLocaleDateString()}</span></p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mt-12 px-4 flex-grow prose prose-zinc max-w-none">
                <h3 className="text-lg font-black text-[#ea580c] uppercase tracking-widest mb-4 border-b-2 border-zinc-100 pb-2">Overview</h3>
                <div className="text-zinc-700 leading-relaxed font-medium">
                    {typeof proposal.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: proposal.content }} />
                    ) : (
                        <p>Please refer to the detailed project requirements and scope as discussed during our initial consultation. This proposal outlines the comprehensive solution tailored to meet your business objectives.</p>
                    )}
                </div>

                {proposal.totalAmount && (
                    <div className="mt-12">
                        <h3 className="text-lg font-black text-[#ea580c] uppercase tracking-widest mb-4 border-b-2 border-zinc-100 pb-2">Investment Summary</h3>
                        <div className="bg-zinc-50 p-6 rounded-[20px] border border-zinc-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-[#ea580c]">Total Professional Fees</p>
                                <p className="text-sm text-zinc-500 font-bold mt-1 uppercase">Including all deliverables and milestones</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-zinc-900">{formatCurrency(proposal.totalAmount)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Signature Section */}
            <div className="mt-20 px-4">
                <h3 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-8">Acceptance</h3>
                <div className="grid grid-cols-2 gap-20">
                    <div className="space-y-4">
                        <div className="h-16 border-b-2 border-zinc-200 flex flex-col justify-end pb-2">
                            {proposal.signatures?.find(s => s.party === 'provider') ? (
                                <div className="text-center">
                                    <p className="font-['Courier_New'] italic text-2xl text-zinc-800">
                                        {proposal.signatures.find(s => s.party === 'provider')?.name || 'Signed'}
                                    </p>
                                    {proposal.signatures.find(s => s.party === 'provider')?.signedAt && (
                                        <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase">
                                            {new Date(proposal.signatures.find(s => s.party === 'provider')?.signedAt as string).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            ) : null}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Authorized Signature ({branding.companyName})</p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-16 border-b-2 border-zinc-200 flex flex-col justify-end pb-2">
                            {proposal.signatures?.find(s => s.party === 'client') ? (
                                <div className="text-center">
                                    <p className="font-['Courier_New'] italic text-2xl text-zinc-800">
                                        {proposal.signatures.find(s => s.party === 'client')?.name}
                                    </p>
                                    {proposal.signatures.find(s => s.party === 'client')?.signedAt && (
                                        <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase">
                                            {new Date(proposal.signatures.find(s => s.party === 'client')?.signedAt as string).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            ) : null}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Client Acceptance Signature</p>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="mt-20 border-t-4 border-[#ea580c] pt-12 pb-8 px-4">
                <div>
                    <h4 className="text-sm font-black text-[#ea580c] uppercase tracking-widest mb-2">Terms & Condition</h4>
                    <p className="text-[10px] leading-relaxed text-zinc-500 font-bold uppercase tracking-wider max-w-2xl">
                        {branding.defaultProposalTerms || 'This proposal is valid for 30 days. All work will commence upon signed acceptance and receipt of initial deposit. Any modifications to the project scope will require a formal change order.'}
                    </p>
                </div>

                <div className="mt-8">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">Pumpkin CRM & Business Suite</p>
                </div>
            </div>

            {/* Bottom Orange Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#ea580c]"></div>
        </div>
    );
};

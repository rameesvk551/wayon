import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, DollarSign, FileText, ArrowRight, CheckCircle2, Share2, Bookmark } from 'lucide-react';
import type { VisaInfo } from '../../data/visaData';
import { visaStatusConfig } from '../../data/visaData';
import { getCountryByCode } from '../../data/countries';
import VisaStatusBadge from './VisaStatusBadge';

interface CountryDetailModalProps {
    visaInfo: VisaInfo | null;
    isOpen: boolean;
    onClose: () => void;
}

const CountryDetailModal: React.FC<CountryDetailModalProps> = ({
    visaInfo,
    isOpen,
    onClose,
}) => {
    if (!visaInfo) return null;

    const country = getCountryByCode(visaInfo.to);
    const config = visaStatusConfig[visaInfo.status];

    if (!country) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="visa-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        className="visa-modal-sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Handle */}
                        <div className="visa-modal-handle" />

                        {/* Header */}
                        <div className="visa-modal-header">
                            <div className="visa-modal-country">
                                <span className="visa-modal-flag">{country.flag}</span>
                                <div>
                                    <h3 className="visa-modal-name">{country.name}</h3>
                                    <span className="visa-modal-region">{country.region}</span>
                                </div>
                            </div>
                            <button className="visa-modal-close" onClick={onClose} type="button">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Status */}
                        <div
                            className="visa-modal-status"
                            style={{ background: config.bg, borderColor: config.border }}
                        >
                            <VisaStatusBadge status={visaInfo.status} size="md" />
                            <span className="visa-modal-stay">{visaInfo.maxStay}</span>
                        </div>

                        {/* Quick Info */}
                        <div className="visa-modal-quick-info">
                            <div className="visa-modal-info-item">
                                <Clock size={16} />
                                <div>
                                    <span className="visa-modal-info-label">Processing</span>
                                    <span className="visa-modal-info-value">{visaInfo.processingTime}</span>
                                </div>
                            </div>
                            <div className="visa-modal-info-item">
                                <DollarSign size={16} />
                                <div>
                                    <span className="visa-modal-info-label">Cost</span>
                                    <span className="visa-modal-info-value">{visaInfo.cost}</span>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="visa-modal-section">
                            <h4 className="visa-modal-section-title">
                                <FileText size={16} />
                                Documents Required
                            </h4>
                            <ul className="visa-modal-docs">
                                {visaInfo.documents.map((doc, i) => (
                                    <li key={i} className="visa-modal-doc-item">
                                        <CheckCircle2 size={14} className="visa-document-check" />
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Next Steps */}
                        <div className="visa-modal-section">
                            <h4 className="visa-modal-section-title">
                                <ArrowRight size={16} />
                                Next Steps
                            </h4>
                            <div className="visa-modal-steps">
                                {visaInfo.nextSteps.map((step, i) => (
                                    <div key={i} className="visa-modal-step">
                                        <span className="visa-next-step-number">{i + 1}</span>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="visa-modal-actions">
                            <button className="visa-modal-action-btn" type="button">
                                <Share2 size={16} />
                                Share
                            </button>
                            <button className="visa-modal-action-btn" type="button">
                                <Bookmark size={16} />
                                Save
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CountryDetailModal;

import { motion } from 'framer-motion';
import { Share2, Bookmark, ArrowLeft, Clock, DollarSign, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { VisaInfo } from '../../data/visaData';
import { visaStatusConfig } from '../../data/visaData';
import { getCountryByCode } from '../../data/countries';
import VisaStatusBadge from './VisaStatusBadge';

interface VisaResultCardProps {
    visaInfo: VisaInfo;
    onBack: () => void;
    onShare?: () => void;
    onSave?: () => void;
}

const VisaResultCard: React.FC<VisaResultCardProps> = ({
    visaInfo,
    onBack,
    onShare,
    onSave,
}) => {
    const fromCountry = getCountryByCode(visaInfo.from);
    const toCountry = getCountryByCode(visaInfo.to);
    const config = visaStatusConfig[visaInfo.status];

    if (!fromCountry || !toCountry) return null;

    return (
        <motion.div
            className="visa-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="visa-result-header">
                <button className="visa-result-back" onClick={onBack} type="button">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="visa-result-title">Visa Requirements</h2>
                <div className="visa-result-actions">
                    <button className="visa-result-action-btn" onClick={onShare} type="button">
                        <Share2 size={18} />
                    </button>
                    <button className="visa-result-action-btn" onClick={onSave} type="button">
                        <Bookmark size={18} />
                    </button>
                </div>
            </div>

            {/* Route Display */}
            <motion.div
                className="visa-result-route"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="visa-result-country">
                    <span className="visa-result-flag">{fromCountry.flag}</span>
                    <span className="visa-result-country-name">{fromCountry.name}</span>
                </div>
                <div className="visa-result-arrow">
                    <ArrowRight size={20} />
                </div>
                <div className="visa-result-country">
                    <span className="visa-result-flag">{toCountry.flag}</span>
                    <span className="visa-result-country-name">{toCountry.name}</span>
                </div>
            </motion.div>

            {/* Status Card */}
            <motion.div
                className="visa-result-status-card"
                style={{ borderColor: config.border, background: `linear-gradient(135deg, ${config.bg} 0%, white 100%)` }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            >
                <div className="visa-result-status-top">
                    <VisaStatusBadge status={visaInfo.status} size="lg" />
                </div>
                <p className="visa-result-status-text">
                    {visaInfo.status === 'visa-free'
                        ? `Great news! Travelers from ${fromCountry.name} can visit ${toCountry.name} without a visa.`
                        : visaInfo.status === 'evisa'
                            ? `An eVisa is available for travelers from ${fromCountry.name} to ${toCountry.name}. Apply online!`
                            : visaInfo.status === 'visa-on-arrival'
                                ? `Travelers from ${fromCountry.name} can get a visa on arrival in ${toCountry.name}.`
                                : `A visa is required for travelers from ${fromCountry.name} to ${toCountry.name}.`}
                </p>
            </motion.div>

            {/* Details Grid */}
            <motion.div
                className="visa-result-details"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="visa-detail-item">
                    <div className="visa-detail-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                        <Clock size={18} />
                    </div>
                    <div className="visa-detail-content">
                        <span className="visa-detail-label">Max Stay</span>
                        <span className="visa-detail-value">{visaInfo.maxStay}</span>
                    </div>
                </div>
                <div className="visa-detail-item">
                    <div className="visa-detail-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                        <Clock size={18} />
                    </div>
                    <div className="visa-detail-content">
                        <span className="visa-detail-label">Processing</span>
                        <span className="visa-detail-value">{visaInfo.processingTime}</span>
                    </div>
                </div>
                <div className="visa-detail-item">
                    <div className="visa-detail-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
                        <DollarSign size={18} />
                    </div>
                    <div className="visa-detail-content">
                        <span className="visa-detail-label">Cost</span>
                        <span className="visa-detail-value">{visaInfo.cost}</span>
                    </div>
                </div>
            </motion.div>

            {/* Documents */}
            <motion.div
                className="visa-result-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="visa-result-section-title">
                    <FileText size={18} />
                    Required Documents
                </h3>
                <ul className="visa-documents-list">
                    {visaInfo.documents.map((doc, i) => (
                        <motion.li
                            key={i}
                            className="visa-document-item"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                        >
                            <CheckCircle2 size={16} className="visa-document-check" />
                            {doc}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Next Steps */}
            <motion.div
                className="visa-result-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="visa-result-section-title">
                    <ArrowRight size={18} />
                    Next Steps
                </h3>
                <div className="visa-next-steps">
                    {visaInfo.nextSteps.map((step, i) => (
                        <motion.div
                            key={i}
                            className="visa-next-step"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                        >
                            <span className="visa-next-step-number">{i + 1}</span>
                            <span>{step}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Edit Search Button (sticky bottom) */}
            <motion.div
                className="visa-result-footer"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <button className="visa-edit-search-btn" onClick={onBack} type="button">
                    Edit Search
                </button>
            </motion.div>
        </motion.div>
    );
};

export default VisaResultCard;

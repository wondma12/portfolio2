import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', trend, trendUp }) => {
    const colors = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        purple: 'from-purple-500 to-pink-500',
        orange: 'from-orange-500 to-red-500',
        yellow: 'from-yellow-500 to-amber-500',
        red: 'from-red-500 to-pink-500'
    };

    return (
        <motion.div 
            className="stats-card"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="stats-card-content">
                <div className="stats-info">
                    <p className="stats-title">{title}</p>
                    <p className="stats-value">{value}</p>
                    {trend && (
                        <div className={`stats-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
                            {trendUp ? <FaArrowUp /> : <FaArrowDown />}
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`stats-icon-wrapper bg-gradient-to-r ${colors[color]}`}>
                    <Icon className="stats-icon" />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
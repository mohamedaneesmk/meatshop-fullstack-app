import React from 'react';
import { MapPin, Phone, Mail, Clock, Beef, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-surface-900 dark:bg-surface-950 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                                <Beef className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="font-display text-2xl font-bold">
                                    SAS <span className="text-primary-400">A1 Beef Stall</span>
                                </h2>
                                <p className="text-xs text-surface-400">Premium Quality</p>
                            </div>
                        </Link>
                        <p className="text-surface-400 text-sm leading-relaxed mb-4">
                            Your trusted source for fresh, premium quality meat. We deliver
                            the finest cuts directly to your doorstep.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-surface-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-surface-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-surface-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-surface-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    Shop All Beef
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-surface-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    Fresh Cuts
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-surface-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    Premium Steaks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/track-order"
                                    className="text-surface-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    Track Your Order
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                                <span className="text-surface-400 text-sm leading-relaxed">
                                    No. 1020, 2nd Avenue,
                                    <br />
                                    Mailai Balaji Nagar,
                                    <br />
                                    Pallikaranai,
                                    <br />
                                    Chennai – 600100,
                                    <br />
                                    Tamil Nadu, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a
                                    href="tel:+916383938001"
                                    className="text-surface-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    +91 63839 38001
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a
                                    href="mailto:sasa1beefstall@gmail.com"
                                    className="text-surface-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    sasa1beefstall@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <span className="text-surface-400 text-sm">
                                    Open: 7:00 AM - 9:00 PM
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Map */}
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-4">
                            Find Us
                        </h3>
                        <div className="rounded-xl overflow-hidden h-48 bg-surface-800">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15555.123456789!2d80.2017!3d12.9366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d0b7b79e12d%3A0x4a5f6e7d8c9b0a1b!2sPallikaranai%2C%20Chennai%2C%20Tamil%20Nadu%20600100!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Store Location"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-surface-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-surface-500 text-sm">
                            © {new Date().getFullYear()} SAS A1 Beef Stall. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="#"
                                className="text-surface-500 hover:text-primary-400 transition-colors text-sm"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-surface-500 hover:text-primary-400 transition-colors text-sm"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-surface-500 hover:text-primary-400 transition-colors text-sm"
                            >
                                Refund Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

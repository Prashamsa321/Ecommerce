import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const [counters, setCounters] = useState({
        customers: 0,
        products: 0,
        orders: 0,
        rating: 0
    });

    const [statsInView, setStatsInView] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const statsSection = document.getElementById('stats-section');
            if (statsSection) {
                const rect = statsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0 && !statsInView) {
                    setStatsInView(true);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [statsInView]);

    useEffect(() => {
        if (statsInView) {
            const animateCounter = (key, target) => {
                let start = 0;
                const duration = 2000;
                const increment = target / (duration / 16);

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= target) {
                        setCounters(prev => ({ ...prev, [key]: target }));
                        clearInterval(timer);
                    } else {
                        setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
                    }
                }, 16);
            };

            animateCounter('customers', 15000);
            animateCounter('products', 500);
            animateCounter('orders', 25000);
            animateCounter('rating', 5);
        }
    }, [statsInView]);

    const testimonials = [
        {
            id: 1,
            name: "Ramesh Sharma",
            role: "Tech Enthusiast",
            rating: 5,
            text: "Best electronics store in Nepal! Genuine products and amazing customer service.",
            initial: "R"
        },
        {
            id: 2,
            name: "Sita Gurung",
            role: "Business Owner",
            rating: 5,
            text: "Quick delivery and excellent support. Highly recommended for all gadget lovers!",
            initial: "S"
        },
        {
            id: 3,
            name: "Bikash Thapa",
            role: "Student",
            rating: 4,
            text: "Got my new laptop at a great price. The EMI option made it super easy!",
            initial: "B"
        }
    ];

    const features = [
        { icon: "🔒", title: "100% Genuine Products", desc: "Official warranty on all electronics" },
        { icon: "🚚", title: "Free Express Shipping", desc: "On orders over NPR 5,000" },
        { icon: "💳", title: "Easy EMI Options", desc: "Flexible payment plans available" },
        { icon: "🛡️", title: "7-Day Replacement", desc: "Hassle-free returns & refunds" },
        { icon: "📞", title: "24/7 Customer Support", desc: "Always here to help you" },
        { icon: "⭐", title: "15K+ Happy Customers", desc: "Trusted by thousands" }
    ];

    const offerings = [
        { icon: "📱", title: "Smartphones", desc: "Latest iPhone, Samsung, OnePlus" },
        { icon: "💻", title: "Laptops", desc: "Gaming, Business, Student laptops" },
        { icon: "🎧", title: "Audio Devices", desc: "Headphones, Speakers, Earbuds" },
        { icon: "⌚", title: "Smart Watches", desc: "Fitness & Lifestyle trackers" },
        { icon: "🎮", title: "Gaming Gear", desc: "Consoles, Controllers, Accessories" },
        { icon: "🏠", title: "Smart Home", desc: "IoT devices & home automation" }
    ];

    const teamMembers = [
        { name: "Prashamsa Lamsal", role: "Founder & CEO", initial: "P", bio: "Tech visionary with 10+ years in eCommerce" },
        { name: "Aarav Shrestha", role: "CTO", initial: "A", bio: "Leading tech innovation and product development" },
        { name: "Riya Karki", role: "Head of Operations", initial: "R", bio: "Ensuring smooth delivery and customer satisfaction" }
    ];

    return (
        <div className="overflow-x-hidden bg-[#0A2540] ">
          

            {/* Company Story Section */}
            <section className="py-16 md:py-20 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-block px-4 py-2 bg-[#FF6200]/10 rounded-full mb-6">
                                <span className="text-sm text-[#FF6200] font-medium">Our Story</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                                From a Dream to Nepal's<br />
                                <span className="text-[#FF6200]">Leading Tech Store</span>
                            </h2>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                MeroGadget started in 2020 with a simple vision: to make premium technology
                                accessible to every Nepali. We saw a gap in the market where quality electronics
                                were either too expensive or came with questionable authenticity.
                            </p>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Today, we've grown into Nepal's most trusted electronics retailer, serving
                                over 15,000+ happy customers with genuine products, competitive prices,
                                and exceptional after-sales support.
                            </p>
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="text-2xl font-bold text-white">2020</div>
                                    <div className="text-sm text-gray-400">Founded</div>
                                </div>
                                <div className="w-px h-8 bg-[#FF6200]"></div>
                                <div>
                                    <div className="text-2xl font-bold text-white">15K+</div>
                                    <div className="text-sm text-gray-400">Customers</div>
                                </div>
                                <div className="w-px h-8 bg-[#FF6200]"></div>
                                <div>
                                    <div className="text-2xl font-bold text-white">500+</div>
                                    <div className="text-sm text-gray-400">Products</div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="/home appliance.png"
                                    alt="MeroGadget Store"
                                    className="w-full h-auto rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t  rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
               
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 md:py-20 bg-[#0A2540]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-2 bg-[#FF6200]/10 rounded-full mb-4">
                            <span className="text-sm text-[#FF6200] font-medium">Our Purpose</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            Mission & Vision
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Guiding our journey to transform tech shopping in Nepal
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#0A2540] rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Our Mission</h3>
                            <p className="text-gray-300 leading-relaxed">
                                To empower Nepali consumers with authentic, high-quality technology products
                                at affordable prices while delivering an unmatched shopping experience.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#0A2540] rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-4xl mb-4">👁️</div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Our Vision</h3>
                            <p className="text-gray-300 leading-relaxed">
                                To become Nepal's most trusted and preferred electronics destination,
                                bridging the gap between global technology and local accessibility.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-16 md:py-20 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-2 bg-[#FF6200]/10 rounded-full mb-4">
                            <span className="text-sm text-[#FF6200] font-medium">Our Offerings</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            What We Offer
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Discover our wide range of premium products and services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {offerings.map((item, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-[#1E3A8A] to-[#0A2540] rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 md:py-20 bg-[#0A2540]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-2 bg-[#FF6200]/10 rounded-full mb-4">
                            <span className="text-sm text-[#FF6200] font-medium">Why Choose Us</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            Why MeroGadget?
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Experience the difference with our premium services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-5 bg-[#111827] rounded-xl border border-[#1E3A8A] hover:border-[#FF6200] transition-all duration-300"
                            >
                                <div className="text-2xl">{feature.icon}</div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section id="stats-section" className="py-16 md:py-20 bg-gradient-to-r from-[#FF6200] to-[#FF3D00]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{counters.customers.toLocaleString()}+</div>
                            <div className="text-white/80 text-sm">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{counters.products}+</div>
                            <div className="text-white/80 text-sm">Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{counters.orders.toLocaleString()}+</div>
                            <div className="text-white/80 text-sm">Orders Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{counters.rating}⭐</div>
                            <div className="text-white/80 text-sm">Customer Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-20 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-2 bg-[#FF6200]/10 rounded-full mb-4">
                            <span className="text-sm text-[#FF6200] font-medium">Our Team</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            Meet the Experts
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Passionate individuals dedicated to serving you better
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-[#111827] rounded-xl p-6 text-center border border-[#1E3A8A] hover:border-[#FF6200] transition-all duration-300 hover:-translate-y-1">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#FF6200] to-[#FF3D00] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {member.initial}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-[#FF6200] text-sm mb-2">{member.role}</p>
                                <p className="text-gray-400 text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 md:py-20 bg-[#0A2540]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-2 bg-[#FF6200]/10 rounded-full mb-4">
                            <span className="text-sm text-[#FF6200] font-medium">Testimonials</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Trusted by thousands of happy customers across Nepal
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-[#111827] rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#1E3A8A]"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6200] to-[#FF3D00] rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.initial}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                                        <p className="text-gray-400 text-xs">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-base ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                                    ))}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">"{testimonial.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-[#1E3A8A] to-[#0A2540]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                        Ready to Upgrade Your Tech?
                    </h2>
                    <p className="text-gray-300 text-base md:text-lg mb-6 max-w-2xl mx-auto">
                        Explore our collection of premium gadgets and electronics at unbeatable prices.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white rounded-full font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
                    >
                        Shop Now
                        <span>→</span>
                    </Link>
                </div>
            </section>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes scroll {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(10px); opacity: 0; }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AboutPage;
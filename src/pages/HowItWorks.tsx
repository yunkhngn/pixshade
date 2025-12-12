import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Waves,
    FileWarning,
    Shield,
    Download,
    Eye,
    EyeOff,
    Cpu,
    Lock,
} from 'lucide-react';

export function HowItWorks() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="w-full py-6 px-4 md:px-8 border-b border-neutral-300/30">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại PixShade</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Title */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-600 font-display mb-4">
                        Cách <span className="text-primary">PixShade</span> Hoạt Động
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Tìm hiểu cách chúng tôi bảo vệ ảnh của bạn khỏi AI training bằng các kỹ thuật
                        frequency-domain perturbation và metadata obfuscation tiên tiến.
                    </p>
                </motion.div>

                {/* Step 1: Advanced Frequency Protection */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Waves className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-600">
                            1. Bảo vệ Tần số Nâng cao
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-600 mb-3">
                                    Multi-Scale DCT Perturbation
                                </h3>
                                <p className="text-neutral-500 mb-4 text-sm leading-relaxed">
                                    Chúng tôi sử dụng phương pháp <strong>Multi-Scale Discrete Cosine Transform (DCT)</strong>
                                    để áp dụng nhiễu bảo vệ trên nhiều dải tần số. Bằng cách hoạt động trên nhiều
                                    quy mô (khối 16x16, 8x8 và 4x4), chúng tôi nhắm mục tiêu cả cấu trúc rộng
                                    và chi tiết nhỏ, khiến các mô hình AI khó khôi phục lại các đặc điểm hình ảnh gốc.
                                </p>
                                <h3 className="text-lg font-semibold text-neutral-600 mb-3">
                                    Tiled Signature & Universal Patterns
                                </h3>
                                <p className="text-neutral-500 mb-4 text-sm leading-relaxed">
                                    Để chống lại việc khớp mẫu (template matching) và các tấn công loại bỏ nhiễu, chúng tôi tiêm một
                                    <strong> deterministic tiled signature</strong> giúp dịch chuyển các hệ số
                                    một cách giả ngẫu nhiên dựa trên seed bảo mật. Trong chế độ 'Strong', chúng tôi cũng áp dụng
                                    <strong> Universal Adversarial Perturbations</strong>—các mẫu nhiễu được huấn luyện cụ thể
                                    để phá vỡ các mô hình thị giác phổ biến.
                                </p>
                                <ul className="mt-4 space-y-2 text-neutral-500 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Eye className="w-4 h-4 text-accent-mint mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Tối ưu hóa thị giác</strong> - được tinh chỉnh để duy trì
                                            chất lượng hình ảnh PSNR cao (&gt;38dB).
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <EyeOff className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Bền vững khi đổi kích thước</strong> - Nhiễu đa quy mô
                                            tồn tại tốt hơn khi bị thu nhỏ so với nhiễu thông thường.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-cream rounded-xl p-6">
                                <div className="text-center mb-4">
                                    <span className="text-sm font-medium text-neutral-400">
                                        Quy trình Bảo vệ
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-xs font-bold">
                                            1
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Áp dụng Universal Perturbation (Strong Mode)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-xs font-bold">
                                            2
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Multi-Scale DCT Decomposition (16/8/4)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                            3
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Mid-Freq Noise Injection & Tiled Shifts
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-xs font-bold">
                                            4
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Tái tạo & Kiểm tra chất lượng PSNR
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Step 2: Metadata Poisoning */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-accent-lavender/50 flex items-center justify-center">
                            <FileWarning className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-600">
                            2. Metadata Poisoning
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <p className="text-neutral-500 mb-6">
                            Các trình thu thập dữ liệu (AI scrapers) thường lấy cả metadata EXIF và XMP (thông tin máy ảnh, vị trí,
                            ngày tháng, v.v.) cùng với hình ảnh. Chúng tôi sử dụng kỹ thuật <strong>Split XMP Injection</strong>
                            để phân tán metadata giả mạo qua nhiều phân đoạn (chunks), khiến việc loại bỏ chúng
                            bằng lập trình trở nên khó khăn hơn trong khi vẫn hợp lệ với các trình đọc tiêu chuẩn.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { label: 'Camera', value: 'Nokia 3310' },
                                { label: 'Location', value: 'North Pole' },
                                { label: 'Date', value: 'January 1, 1995' },
                                { label: 'Software', value: 'MS Paint 3.11' },
                                { label: 'Copyright', value: 'Public Domain 1901' },
                                { label: 'Artist', value: 'AI Generated' },
                            ].map((item, idx) => (
                                <div
                                    key={item.label}
                                    className="p-4 rounded-xl bg-cream border border-neutral-300/30"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <span className="text-xs font-medium text-neutral-400">
                                            {item.label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-600">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Step 3: Style Protection (GLAZE-inspired) */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-600">
                            3. Bảo vệ Style (GLAZE-inspired)
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <p className="text-neutral-500 mb-6">
                            Lấy cảm hứng từ công cụ <strong>GLAZE</strong> của Đại học Chicago, chức năng này
                            áp dụng các kỹ thuật <strong>adversarial perturbation</strong> để ngăn AI học và
                            sao chép phong cách vẽ độc đáo của bạn.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <h4 className="font-semibold text-neutral-700 mb-2">
                                    LAB Color Shift
                                </h4>
                                <p className="text-xs text-neutral-500">
                                    Dịch chuyển màu sắc trong không gian LAB để làm AI
                                    nhận diện sai style và bảng màu của tác phẩm.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <h4 className="font-semibold text-neutral-700 mb-2">
                                    Edge Disruption
                                </h4>
                                <p className="text-xs text-neutral-500">
                                    Thêm nhiễu vào các đường nét mà AI dựa vào để
                                    nhận diện phong cách vẽ độc đáo của bạn.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <h4 className="font-semibold text-neutral-700 mb-2">
                                    Texture Confusion
                                </h4>
                                <p className="text-xs text-neutral-500">
                                    Tạo các mẫu nhiễu đa tần số để làm rối loạn
                                    việc phân tích texture của AI models.
                                </p>
                            </div>
                        </div>

                        <div className="bg-cream rounded-xl p-4">
                            <p className="text-sm text-neutral-500">
                                <strong className="text-purple-600">Lưu ý:</strong> Đây là phiên bản client-side
                                lấy cảm hứng từ GLAZE. Không giống GLAZE gốc cần GPU và deep learning models,
                                PixShade sử dụng các thuật toán perturbation được thiết kế để chạy hoàn toàn
                                trong trình duyệt của bạn.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Privacy Section */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-accent-mint/50 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-600">
                            Quyền riêng tư của bạn
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-4">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-mint/30 flex items-center justify-center">
                                    <Cpu className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-neutral-600 mb-2">
                                    100% Client-Side
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    Mọi quá trình xử lý diễn ra trên trình duyệt của bạn. Hình ảnh
                                    không bao giờ rời khỏi thiết bị.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Shield className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-neutral-600 mb-2">
                                    Không thu thập dữ liệu
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    Chúng tôi không lưu trữ, theo dõi hoặc thu thập bất kỳ hình ảnh
                                    hoặc dữ liệu cá nhân nào của bạn.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-lavender/50 flex items-center justify-center">
                                    <Download className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-neutral-600 mb-2">
                                    Tải về ngay lập tức
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    Ảnh đã bảo vệ được tạo ngay lập tức và tải trực tiếp về thiết bị.
                                    Hỗ trợ chế độ 'Basic' và 'Strong' để cân bằng giữa tốc độ và bảo mật.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-2xl shadow-soft transition-colors text-lg"
                    >
                        <Shield className="w-6 h-6" />
                        Bắt đầu bảo vệ ảnh của bạn
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}

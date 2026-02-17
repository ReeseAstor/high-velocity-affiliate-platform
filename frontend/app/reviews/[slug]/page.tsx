import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface ReviewProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const reviewsDir = path.join(process.cwd(), 'app/content/reviews');
    // Enhance robustness: ensure directory exists
    if (!fs.existsSync(reviewsDir)) {
        return [];
    }

    const files = fs.readdirSync(reviewsDir);

    return files
        .filter((file) => file.endsWith('.md'))
        .map((file) => ({
            slug: file.replace('.md', ''),
        }));
}

export default async function ReviewPage({ params }: ReviewProps) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const filePath = path.join(process.cwd(), 'app/content/reviews', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Review not found</h1>
            </div>
        )
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            {/* FTC Disclosure */}
            {data.is_sponsored && (
                <div className="bg-slate-100 dark:bg-slate-800 border-l-4 border-blue-500 p-4 mb-8 text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold">Transparency Note:</p>
                    <p>
                        This content is reader-supported. If you click on links and buy products we review, we may earn an affiliate commission.
                        However, this does not influence our editorial integrity.
                    </p>
                </div>
            )}

            {/* Header */}
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 gradient-text pb-2">
                    {data.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    {data.description}
                </p>
                <div className="mt-4 text-sm text-slate-500">
                    Published on {data.date}
                </div>
            </header>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="card-glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center">
                        <span className="mr-2">👍</span> The Good
                    </h3>
                    <ul className="space-y-2">
                        {data.pros?.map((pro: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                                <span className="mr-2 text-green-500">✓</span>
                                <span>{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card-glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
                        <span className="mr-2">👎</span> The Bad
                    </h3>
                    <ul className="space-y-2">
                        {data.cons?.map((con: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                                <span className="mr-2 text-red-500">✗</span>
                                <span>{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <ReactMarkdown
                    components={{
                        a: ({ node, ...props }) => {
                            // Check if link matches affiliate link
                            const isAffiliate = props.href === data.affiliate_link;
                            return (
                                <a
                                    {...props}
                                    rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                                    target="_blank"
                                    className={isAffiliate ? "text-blue-600 font-bold hover:underline" : undefined}
                                />
                            );
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>

            {/* Verdict / CTA */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl text-center shadow-2xl">
                <h2 className="text-3xl font-bold mb-4">The Verdict</h2>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                    {data.verdict}
                </p>
                <a
                    href={data.affiliate_link}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                    Check Price for {data.product_name}
                </a>
            </div>

            <div className="mt-12 text-center">
                <Link href="/" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline">
                    ← Back to Home
                </Link>
            </div>
        </article>
    );
}

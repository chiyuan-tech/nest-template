import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FriendLink } from '../lib/server-api';
import { siteConfig, contactConfig } from '@/website-config';

interface FooterProps {
  friendlyLinks?: FriendLink[];
}

export function Footer({ friendlyLinks = [] }: FooterProps) {
  return (
    <footer className="bg-[#141413] px-6 py-16 text-white sm:px-10 lg:px-16 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mc-eyebrow mb-5 text-white/55">Support</p>
          <h2 className="text-4xl leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">
            We're always here when you need us.
          </h2>
        </div>

        {friendlyLinks.length > 0 && (
          <div className="mb-10 border-b border-white/20 pb-6">
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.04em] text-white/55">
              Partner Sites
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {friendlyLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/65 transition-colors duration-200 hover:text-white hover:underline"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 border-b border-white/20 pb-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center">
              <span className="font-poppins text-2xl font-bold tracking-[-0.02em] text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Create cinematic AI videos with a calm, editorial workspace and reliable generation tools.
            </p>
            <a
              href={`mailto:${contactConfig.supportEmail}`}
              className="mt-6 inline-flex items-center rounded-full border border-white/35 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-white hover:text-[#141413]"
            >
              <Mail className="mr-2 h-4 w-4" />
              {contactConfig.supportEmail}
            </a>
          </div>

          <div>
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.04em] text-white/55">
              Navigation
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.04em] text-white/55">
              Legal
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025 {siteConfig.name}. All rights reserved.</p>
          <div className="rounded-full border border-white/30 px-4 py-2 text-white/70">
            United States - English
          </div>
        </div>
      </div>
    </footer>
  );
}

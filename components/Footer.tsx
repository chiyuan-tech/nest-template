import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FriendLink } from '../lib/server-api';
import { siteConfig, contactConfig } from '@/website-config';

interface FooterProps {
  friendlyLinks?: FriendLink[];
}

export function Footer({ friendlyLinks = [] }: FooterProps) {
  return (
    <footer className="bg-background px-6 py-16 text-muted-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        {friendlyLinks.length > 0 && (
          <div className="mb-10 border-b border-border pb-8">
            <div className="mb-4 text-[13px] font-medium">Partner sites</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {friendlyLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] hover:text-foreground hover:underline"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-foreground">
              <span className="h-8 w-8 rounded-full bg-primary text-center text-sm font-semibold leading-8 text-primary-foreground">F</span>
              <span className="text-[15px] font-medium">{siteConfig.name}</span>
            </Link>
            <p className="max-w-sm text-[13px] leading-5">
              A dark-canvas website template with pricing, auth, SEO defaults, and Framer-inspired marketing surfaces.
            </p>
            <a
              href={`mailto:${contactConfig.supportEmail}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              <Mail className="h-4 w-4" />
              {contactConfig.supportEmail}
            </a>
          </div>

          <div>
            <div className="mb-3 text-[13px] font-medium text-foreground">Navigation</div>
            <ul className="space-y-2">
              <li><Link href="/" className="text-[13px] hover:text-foreground">Home</Link></li>
              <li><Link href="/blog" className="text-[13px] hover:text-foreground">Blog</Link></li>
              <li><Link href="/pricing" className="text-[13px] hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-[13px] font-medium text-foreground">Legal</div>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-[13px] hover:text-foreground">Terms</Link></li>
              <li><Link href="/privacy" className="text-[13px] hover:text-foreground">Privacy</Link></li>
              <li><Link href="/refund" className="text-[13px] hover:text-foreground">Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-[12px]">
          © 2025 {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import 'server-only';

import { Resend } from 'resend';
import type { Lead } from '@/types/lead';

const resendApiKey = process.env.RESEND_API_KEY;
const leadNotifyEmail = process.env.LEAD_NOTIFY_EMAIL;
const leadFromEmail = process.env.LEAD_FROM_EMAIL || 'Dubai Property IQ <onboarding@resend.dev>';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function formatValue(value: string | null | undefined) {
  return value?.trim() || '-';
}

function formatSourceType(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function buildLeadNotificationText(lead: Lead) {
  return [
    'New lead captured on Dubai Property IQ.',
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${formatValue(lead.phone)}`,
    `Nationality: ${formatValue(lead.nationality)}`,
    `Source: ${formatSourceType(lead.source_type)}`,
    `Source page: ${lead.source_page}`,
    `Area / interest: ${formatValue(lead.area_of_interest)}`,
    `Status: ${lead.status}`,
    `Captured at: ${new Date(lead.created_at).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}`,
    '',
    'Tracking',
    `UTM source: ${formatValue(lead.utm_source)}`,
    `UTM medium: ${formatValue(lead.utm_medium)}`,
    `UTM campaign: ${formatValue(lead.utm_campaign)}`,
    '',
    'Message',
    formatValue(lead.message),
  ].join('\n');
}

function buildLeadNotificationHtml(lead: Lead) {
  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', formatValue(lead.phone)],
    ['Nationality', formatValue(lead.nationality)],
    ['Source', formatSourceType(lead.source_type)],
    ['Source page', lead.source_page],
    ['Area / interest', formatValue(lead.area_of_interest)],
    ['Status', lead.status],
    ['Captured at', new Date(lead.created_at).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })],
    ['UTM source', formatValue(lead.utm_source)],
    ['UTM medium', formatValue(lead.utm_medium)],
    ['UTM campaign', formatValue(lead.utm_campaign)],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:13px;width:150px;">${label}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="padding:20px 24px;background:#2563eb;color:#ffffff;">
          <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Dubai Property IQ</p>
          <h1 style="margin:8px 0 0;font-size:22px;line-height:1.25;">New lead captured</h1>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${tableRows}
        </table>
        <div style="padding:18px 24px;">
          <h2 style="margin:0 0 8px;font-size:15px;">Message</h2>
          <p style="margin:0;white-space:pre-line;color:#334155;font-size:14px;line-height:1.6;">${escapeHtml(formatValue(lead.message))}</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendLeadNotificationEmail(lead: Lead) {
  if (!resend || !leadNotifyEmail) {
    return;
  }

  const { error } = await resend.emails.send({
    from: leadFromEmail,
    to: leadNotifyEmail,
    replyTo: lead.email,
    subject: `New ${formatSourceType(lead.source_type)} lead: ${lead.name}`,
    text: buildLeadNotificationText(lead),
    html: buildLeadNotificationHtml(lead),
  });

  if (error) {
    throw new Error(error.message);
  }
}

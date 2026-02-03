import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: `Portfolio Contact: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 8px;">
            New Contact Form Submission
          </h2>

          <div style="margin: 24px 0;">
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
              From
            </p>
            <p style="margin: 0; font-size: 16px; color: #1a1a1a;">
              ${name}
            </p>
          </div>

          <div style="margin: 24px 0;">
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
              Email
            </p>
            <p style="margin: 0; font-size: 16px; color: #1a1a1a;">
              <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
            </p>
          </div>

          <div style="margin: 24px 0;">
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
              Message
            </p>
            <div style="background: #f5f5f5; padding: 16px; border-left: 4px solid #1a1a1a;">
              <p style="margin: 0; font-size: 16px; color: #1a1a1a; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />

          <p style="color: #999; font-size: 12px; margin: 0;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

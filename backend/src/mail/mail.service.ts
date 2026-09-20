import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface SendEmailVerificationParams {
    email: string;
    token: string;
}

@Injectable()
export class MailService {
    private readonly resend: Resend;
    private readonly frontendUrl: string;
    private readonly from: string;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
        if (!apiKey) {
            throw new Error(`RESEND_API_KEY is not configured`)
        }

        this.resend = new Resend(apiKey)
        this.frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL',) ?? 'http://localhost:5173'
        this.from = this.configService.getOrThrow<string>('MAIL_FROM',) ?? 'Bookshelf <onboarding@resend.dev>';
    }

    async sendEmailVerification({
        email,
        token,
    }: SendEmailVerificationParams) {
        const baseUrl =
            this.frontendUrl.replace(
                /\/$/,
                '',
            );

        const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token) }`;

        const {data, error } = await this.resend.emails.send({
            from: this.from,
            to: email,
            subject:
                'Verify your Bookshelf email',
            html: `
                <div style="
                        font-family: Arial, sans-serif;
                        max-width: 520px;
                        margin: 0 auto; ">
                    <h2>
                        Verify your email
                    </h2>

                    <p>
                        Thanks for creating your
                        Bookshelf account.
                    </p>

                    <p>
                        Click the button below to
                        verify your email address.
                    </p>

                    <a href="${verificationUrl}" style="
                            display: inline-block;
                            padding: 12px 20px;
                            border-radius: 8px;
                            background: #6366f1;
                            color: white;
                            text-decoration: none; ">
                        Verify email
                    </a>

                    <p style="
                            margin-top: 24px;
                            font-size: 13px;>
                        This link expires in
                        30 minutes.
                    </p>
                </div>
            `,
        });

        if (error) {
            throw new Error(
                `Failed to send verification email: ${error.message}`,
            );
        }

        return data;
    }
}

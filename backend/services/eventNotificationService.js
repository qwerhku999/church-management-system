const Notification = require("../models/Notification");
const Member = require("../models/Member");

/*
 * Format an event date for messages.
 */
const formatDate = (date) => {
    if (!date) return "TBD";

    return new Date(date).toLocaleDateString("en-GH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

/*
 * Build the event location.
 */
const getLocation = (event) => {
    if (event.location?.isOnline) {
        return event.location.onlineLink
            ? `Online: ${event.location.onlineLink}`
            : "Online event";
    }

    const parts = [
        event.location?.name,
        event.location?.room,
        event.location?.address,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "Location to be announced";
};

/*
 * Build the notification message.
 */
const buildMessage = (event, member) => {
    const firstName = member.firstName || "Member";

    const date = formatDate(event.startDate);

    let time = "";

    if (event.startTime && event.endTime) {
        time = ` from ${event.startTime} to ${event.endTime}`;
    } else if (event.startTime) {
        time = ` at ${event.startTime}`;
    }

    const location = getLocation(event);

    return `Hello ${firstName}, ${event.title} has been published for ${date}${time}. Location: ${location}.`;
};

/*
 * Send an email through Brevo HTTP API.
 *
 * This is optional.
 *
 * Required environment variables:
 *
 * BREVO_API_KEY
 * BREVO_SENDER_EMAIL
 * BREVO_SENDER_NAME
 */
const sendEmail = async (member, event) => {
    if (!member.email) {
        return {
            sent: false,
            reason: "Member has no email address.",
        };
    }

    if (
        !process.env.BREVO_API_KEY ||
        !process.env.BREVO_SENDER_EMAIL
    ) {
        return {
            sent: false,
            reason: "Brevo email service is not configured.",
        };
    }

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",

            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },

            body: JSON.stringify({
                sender: {
                    name:
                        process.env.BREVO_SENDER_NAME ||
                        "MinistryFlow",

                    email: process.env.BREVO_SENDER_EMAIL,
                },

                to: [
                    {
                        email: member.email,
                        name: `${member.firstName} ${member.lastName}`,
                    },
                ],

                subject: `New Church Event: ${event.title}`,

                textContent: buildMessage(event, member),

                htmlContent: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>${event.title}</h2>

            <p>
              Hello ${member.firstName || "Member"},
            </p>

            <p>
              A new church event has been published.
            </p>

            <p>
              <strong>Date:</strong>
              ${formatDate(event.startDate)}
            </p>

            ${event.startTime
                        ? `
                  <p>
                    <strong>Time:</strong>
                    ${event.startTime}
                    ${event.endTime
                            ? ` - ${event.endTime}`
                            : ""
                        }
                  </p>
                `
                        : ""
                    }

            <p>
              <strong>Location:</strong>
              ${getLocation(event)}
            </p>

            ${event.description
                        ? `
                  <p>
                    ${event.description}
                  </p>
                `
                        : ""
                    }

            <p>
              <strong>MinistryFlow</strong>
            </p>
          </div>
        `,
            }),
        }
    );

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Brevo email failed: ${response.status} ${body}`
        );
    }

    return {
        sent: true,
    };
};

/*
 * Send SMS through Twilio HTTP API.
 *
 * This is optional.
 *
 * Required environment variables:
 *
 * TWILIO_ACCOUNT_SID
 * TWILIO_AUTH_TOKEN
 * TWILIO_PHONE_NUMBER
 */
const sendSms = async (member, event) => {
    if (!member.phone) {
        return {
            sent: false,
            reason: "Member has no phone number.",
        };
    }

    if (
        !process.env.TWILIO_ACCOUNT_SID ||
        !process.env.TWILIO_AUTH_TOKEN ||
        !process.env.TWILIO_PHONE_NUMBER
    ) {
        return {
            sent: false,
            reason: "Twilio SMS service is not configured.",
        };
    }

    const accountSid =
        process.env.TWILIO_ACCOUNT_SID;

    const authToken =
        process.env.TWILIO_AUTH_TOKEN;

    const credentials = Buffer.from(
        `${accountSid}:${authToken}`
    ).toString("base64");

    const params = new URLSearchParams();

    params.append(
        "From",
        process.env.TWILIO_PHONE_NUMBER
    );

    params.append("To", member.phone);

    params.append(
        "Body",
        buildMessage(event, member)
    );

    const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
            method: "POST",

            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },

            body: params.toString(),
        }
    );

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Twilio SMS failed: ${response.status} ${body}`
        );
    }

    return {
        sent: true,
    };
};

/*
 * Notify all active members when an event is published.
 */
const notifyMembersAboutEvent = async (event) => {
    const members = await Member.find({
        isActive: true,
        membershipStatus: "active",
    })
        .select(
            "firstName lastName email phone linkedUser"
        )
        .lean();

    let inAppSent = 0;
    let emailSent = 0;
    let smsSent = 0;

    let emailFailed = 0;
    let smsFailed = 0;

    /*
     * In-app notifications
     */
    const inAppNotifications = members
        .filter((member) => member.linkedUser)
        .map((member) => ({
            title: `New Event: ${event.title}`,

            message: buildMessage(event, member),

            type: "event",

            recipient: member.linkedUser,

            sender: event.createdBy || event.organizer,

            link: `/events?event=${event._id}`,

            metadata: {
                eventId: event._id,
                category: event.category,
            },

            priority: "normal",
        }));

    if (inAppNotifications.length) {
        await Notification.insertMany(
            inAppNotifications
        );

        inAppSent = inAppNotifications.length;
    }

    /*
     * Email + SMS
     *
     * These are intentionally processed one member
     * at a time so one failed message does not stop
     * the remaining members.
     */
    for (const member of members) {
        if (member.email) {
            try {
                const result = await sendEmail(
                    member,
                    event
                );

                if (result.sent) {
                    emailSent++;
                }
            } catch (error) {
                emailFailed++;

                console.error(
                    `Event email failed for ${member.email}:`,
                    error.message
                );
            }
        }

        if (member.phone) {
            try {
                const result = await sendSms(
                    member,
                    event
                );

                if (result.sent) {
                    smsSent++;
                }
            } catch (error) {
                smsFailed++;

                console.error(
                    `Event SMS failed for ${member.phone}:`,
                    error.message
                );
            }
        }
    }

    return {
        totalMembers: members.length,
        inAppSent,
        emailSent,
        smsSent,
        emailFailed,
        smsFailed,
    };
};

module.exports = {
    notifyMembersAboutEvent,
};
# Culqi Payments — Future Foundation

Status: documented only. No live Culqi integration exists in this branch.

## Goal

Use Culqi later for an advance/deposit after owner approval. The booking flow
must still protect availability first; payment must not create an instant
confirmed reservation without owner confirmation.

## Required Later

- `CULQI_PUBLIC_KEY`
- `CULQI_PRIVATE_KEY`
- `CULQI_WEBHOOK_SECRET`
- Culqi account in the business/legal name
- RUC/business onboarding status
- deposit policy
- cancellation/refund policy
- notification email

## Options

- Culqi Checkout: faster hosted or embedded checkout flow.
- Culqi API: more custom control, more implementation and testing.
- Webhooks: required either way so paid status is set from Culqi server events,
  not from client-side redirects.

## Recommended Flow

1. Guest sends reservation request.
2. Server re-checks availability, including latest Airbnb iCal blocks.
3. Owner marks request as ready for payment.
4. Server creates Culqi payment for the deposit/advance in PEN.
5. Guest pays through Culqi.
6. Culqi webhook confirms payment server-side.
7. Reservation becomes `confirmed`.
8. Website `.ics` feed blocks dates for Airbnb import.

## Security Notes

- Private key stays server-only.
- Webhook secret stays server-only.
- Never store card data.
- Store only provider payment id, amount, currency, status, and timestamps.
- Treat payment success page as informational; webhook is source of truth.
- Confirm amount/currency before marking paid.

## Database Placeholder

`payment_intents` is prepared in the migration:

- provider: `culqi`
- provider payment id
- amount
- currency: `PEN`
- status
- reservation request link

## Open Questions

- Deposit amount: first night, fixed percent, or custom amount?
- Refund window and no-show policy?
- Cancellation cutoff?
- Whether foreign cards, Yape, or bank transfers should be offered first?
- Who receives payment failure/refund notifications?

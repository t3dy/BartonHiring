export async function ntfy(topic: string, title: string, tags: string, content: string): Promise<void> {
  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: {
        Title: title,
        Priority: 'high',
        Tags: tags,
      },
      body: content,
    });
  } catch (e) {
    console.error('ntfy notification failed:', e);
  }
}

export async function pushSmartMovingLead(params: {
  fullName: string;
  phoneNumber: string;
  email: string;
  userOptIn: boolean;
  referralSource: string;
}): Promise<void> {
  const key = process.env.SMARTMOVING_PROVIDER_KEY;
  if (!key) return;

  try {
    await fetch(`https://api.smartmoving.com/api/leads/from-provider/v2?providerKey=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch (e) {
    console.error('SmartMoving lead push failed:', e);
  }
}

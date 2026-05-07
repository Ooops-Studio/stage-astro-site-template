<script lang="ts">
  let email = $state('');
  let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
  let message = $state('');

  const submit = async () => {
    if (!email.trim()) return;
    status = 'submitting';
    message = '';

    const baseUrl = import.meta.env.PUBLIC_STAGE_API_BASE_URL?.replace(/\/$/, '') || '';
    const token = import.meta.env.PUBLIC_NEWSLETTER_FORM_TOKEN || '';

    if (!baseUrl || !token) {
      status = 'error';
      message = 'Newsletter form is not configured yet.';
      return;
    }

    const response = await fetch(`${baseUrl}/api/stage/public/forms/${token}/submissions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers: { email: email.trim() } })
    });

    if (!response.ok) {
      status = 'error';
      message = 'The submission failed. Please try again.';
      return;
    }

    status = 'success';
    message = 'Thanks. You are on the list.';
    email = '';
  };
</script>

<form class="newsletter" onsubmit={(event) => { event.preventDefault(); void submit(); }}>
  <label for="newsletter-email">Newsletter</label>
  <div class="newsletter-row">
    <input
      id="newsletter-email"
      bind:value={email}
      type="email"
      autocomplete="email"
      placeholder="you@example.com"
      disabled={status === 'submitting'}
      required
    />
    <button class="button" type="submit" disabled={status === 'submitting'}>
      {status === 'submitting' ? 'Sending...' : 'Subscribe'}
    </button>
  </div>
  {#if message}
    <p class:success={status === 'success'} class:error={status === 'error'}>{message}</p>
  {/if}
</form>

<style>
  .newsletter {
    display: grid;
    gap: 12px;
    max-width: 560px;
    padding: 24px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
  }

  label {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .newsletter-row {
    display: flex;
    gap: 12px;
  }

  input {
    width: 100%;
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: #fff;
    color: var(--color-text);
    font: inherit;
  }

  button {
    border: 0;
    cursor: pointer;
  }

  button:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  p {
    font-size: 14px;
  }

  .success {
    color: #137a3f;
  }

  .error {
    color: #a92718;
  }

  @media (max-width: 640px) {
    .newsletter-row {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>

let messages = [
    { type: "received", text: "Hi! Is the cleaning service still available this weekend?", time: "10:02" },
    { type: "sent",     text: "Yes, available! Saturday or Sunday morning.", time: "10:04" },
    { type: "received", text: "Saturday works. Would you do R300?", time: "10:06" },
    { type: "sent",     text: "💰 Best offer: R320", time: "10:07" }
];

function renderMessages() {
    const c = document.getElementById('chatMessages');
    c.innerHTML = '<div class="chat-date-divider">Today • Connected with Thabo M.</div>';
    messages.forEach(msg => {
        const d = document.createElement('div');
        d.className = `message-wrap ${msg.type}`;
        d.innerHTML = `<div class="message-bubble ${msg.type}">${msg.text}</div>
                       <div class="message-meta">${msg.type==='sent'?'You':'Thabo M.'} · ${msg.time}</div>`;
        c.appendChild(d);
    });
    c.scrollTop = c.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    messages.push({ type:"sent", text, time:now });
    renderMessages();
    input.value = '';
}

function sendOffer() {
    const amount = document.getElementById('offerInput').value;
    if (!amount) return;
    const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    messages.push({ type:"sent", text:`💰 Offer: R${amount}`, time:now });
    renderMessages();
    document.getElementById('offerInput').value = '';
}

document.getElementById('chatInput').addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

renderMessages();
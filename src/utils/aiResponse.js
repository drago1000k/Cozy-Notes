export function getAiResponse(mood, message) {
  const msgLower = message.toLowerCase();
  
  // Detect Vietnamese characters
  const isVietnamese = /[àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳýỹỷỵ]/.test(msgLower);

  if (isVietnamese) {
    if (msgLower.includes('chào') || msgLower.includes('hi')) {
      return "Chào người bạn phương xa. Đại dương đã mang tin nhắn của bạn đến đây. Chúc bạn một ngày tốt lành.";
    }
    if (msgLower.includes('buồn') || msgLower.includes('mệt')) {
      return "Cảm thấy mệt mỏi là chuyện bình thường. Hãy nghỉ ngơi một chút, ngày mai trời lại sáng.";
    }
    if (mood === 'rainy') {
      const viRainy = ["Tiếng mưa thật hoàn hảo để tập trung. Nhớ giữ ấm nhé.", "Mưa gột rửa mọi thứ. Một khởi đầu mới đang chờ bạn ngoài cửa sổ.", "Tôi cũng đang nghe tiếng mưa rơi. Chúng ta được kết nối qua cơn mưa này."];
      return viRainy[Math.floor(Math.random() * viRainy.length)];
    }
    if (mood === 'magical') {
      const viMagical = ["Tôi vừa thấy một ngôi sao băng và nhớ đến tin nhắn của bạn.", "Vũ trụ luôn có cách sắp xếp mọi thứ. Hãy tin vào những điều kỳ diệu.", "Năng lượng tích cực của bạn đang tỏa sáng rực rỡ qua đại dương."];
      return viMagical[Math.floor(Math.random() * viMagical.length)];
    }
    if (mood === 'clear') {
      const viClear = ["Nắng đang chiếu rất đẹp. Tôi gửi cho bạn một chút hơi ấm nhé.", "Bầu trời trong xanh mang lại một tâm trí thông suốt. Bạn sẽ làm được thôi!", "Một ngày tuyệt đẹp để tạo ra những bước tiến mới."];
      return viClear[Math.floor(Math.random() * viClear.length)];
    }
    const viCozy = ["Tôi đã nhận được chiếc chai của bạn. Nhớ rằng bạn đang làm rất tốt nhé.", "Hít một hơi thật sâu. Dù bạn đang làm gì, cứ bước từng bước một.", "Đôi khi cách tốt nhất để làm việc hiệu quả là nhâm nhi một tách trà nóng.", "Gửi đến bạn những rung cảm bình yên qua đại dương."];
    return viCozy[Math.floor(Math.random() * viCozy.length)];
  }

  // English fallback
  if (msgLower.includes('hello') || msgLower.includes('hi')) {
    return "Hello friend. The ocean brought your message to me. I hope your day is going well.";
  }
  
  if (msgLower.includes('sad') || msgLower.includes('tired')) {
    return "It's okay to feel tired. The tide always turns. Rest for now, and try again tomorrow.";
  }

  // Mood-based generic responses
  if (mood === 'rainy') {
    const rainyResponses = [
      "The sound of the rain is perfect for focusing. I hope you're staying warm.",
      "Rain washes everything clean. A fresh start is right outside your window.",
      "I'm listening to the rain too. We're connected through the storm."
    ];
    return rainyResponses[Math.floor(Math.random() * rainyResponses.length)];
  }

  if (mood === 'magical') {
    const magicalResponses = [
      "I saw a shooting star tonight and thought of your message.",
      "The universe has a way of working things out. Trust the magic.",
      "Your energy is glowing across the sea."
    ];
    return magicalResponses[Math.floor(Math.random() * magicalResponses.length)];
  }

  if (mood === 'clear') {
    const clearResponses = [
      "The sun is shining brightly over here. I'm sending some of that warmth your way.",
      "Clear skies mean clear minds. You've got this!",
      "A beautiful day to make some progress."
    ];
    return clearResponses[Math.floor(Math.random() * clearResponses.length)];
  }

  // Fallback / Cozy
  const cozyResponses = [
    "I received your bottle. Just wanted to remind you that you're doing great.",
    "Take a deep breath. Whatever you're working on, take it one step at a time.",
    "Sometimes the best productivity hack is a warm cup of tea.",
    "I'm sending positive vibes across the ocean to you."
  ];
  return cozyResponses[Math.floor(Math.random() * cozyResponses.length)];
}

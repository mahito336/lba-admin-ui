// LBA CENTRAL API の WebApp URL（必ず /exec を使う）
const API_BASE = "https://script.google.com/macros/s/<<<YOUR_DEPLOY_ID>>>/exec";

const urlParams = new URLSearchParams(location.search);
const tenantId = urlParams.get("tenantId");
const token = urlParams.get("token");

const content = document.getElementById("content");

if (!tenantId || !token) {
  content.innerHTML = "<p>URLが不正です。</p>";
} else {
  loadState();
}

async function loadState() {
  const res = await fetch(`${API_BASE}?mode=provision-state&tenantId=${tenantId}&token=${token}`);
  const data = await res.json();

  if (!data.ok) {
    content.innerHTML = `<p>${data.error}</p>`;
    return;
  }

  if (data.done) {
    content.innerHTML = `
      <p>このテナントはすでに構築済みです。</p>
      <div class="section">
        <p>管理シート：<br><a href="${data.webappUrl}" target="_blank">${data.webappUrl}</a></p>
      </div>
      <div class="section">
        <p>講師ポータル：<br><a href="${data.portalUrl}" target="_blank">${data.portalUrl}</a></p>
      </div>
      <div class="section">
        <p>受講者予約ページ：<br><a href="${data.publicUrl}" target="_blank">${data.publicUrl}</a></p>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <p>以下のテナントの環境構築を行えます：</p>
    <p><b>Tenant ID:</b> ${tenantId}</p>

    <div class="section">
      <label>講師のGoogleアカウント：</label>
      <input type="email" id="ownerEmail" placeholder="example@gmail.com" />
      <button onclick="buildEnv()">環境構築を実行</button>
    </div>
  `;
}

async function buildEnv() {
  const email = document.getElementById("ownerEmail").value;
  if (!email) {
    alert("メールアドレスを入力してください。");
    return;
  }

  const res = await fetch(API_BASE + "?mode=provision-build", {
    method: "POST",
    body: JSON.stringify({
      tenantId,
      token,
      ownerEmail: email
    })
  });

  const data = await res.json();
  if (data.ok) {
    alert("環境構築が完了しました！");
    location.reload();
  } else {
    alert("エラー：" + data.error);
  }
}

# Hosting on GitHub Pages with a Custom Domain

## 1. Buy a Domain
Purchase from any registrar (Namecheap, Cloudflare, Google Domains, etc.). You only need the domain — no separate hosting or server required since GitHub Pages handles that.

## 2. Enable GitHub Pages
1. Go to your GitHub repo → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Choose `MainBr` branch, root `/` folder
4. Click **Save**
5. Your site will be live at `https://<username>.github.io/<repo-name>/`

## 3. Add a CNAME File to the Repo
Create a file called `CNAME` (no extension) in the repo root containing just your domain:
```
yourdomain.com
```
This tells GitHub Pages to serve the site on your custom domain.

## 4. Configure DNS at Your Domain Registrar
Add these DNS records in your registrar's dashboard:

**For apex domain (yourdomain.com):**
| Type | Value |
|------|-------|
| A | 185.199.108.153 |
| A | 185.199.109.153 |
| A | 185.199.110.153 |
| A | 185.199.111.153 |

**For www subdomain (www.yourdomain.com):**
| Type | Value |
|------|-------|
| CNAME | `<username>.github.io` |

## 5. Enable HTTPS
1. Back in GitHub repo → **Settings** → **Pages**
2. Enter your custom domain and click **Save**
3. Check **Enforce HTTPS** (may take a few minutes to become available after DNS propagates)

## 6. Wait for DNS Propagation
DNS changes can take 10 minutes to 48 hours. You can verify with `dig yourdomain.com` or an online DNS checker.

## Cost Summary
- **Domain:** ~$10-15/year
- **Hosting:** Free (GitHub Pages)
- **HTTPS:** Free and automatic

## Verification Checklist
- [ ] `https://yourdomain.com` loads the site
- [ ] `https://www.yourdomain.com` redirects or loads
- [ ] Padlock icon shows in browser (HTTPS working)
- [ ] All pages (index, resume, projects, contact) navigate correctly

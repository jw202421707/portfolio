# 이지우 포트폴리오

인공지능 연구와 개발 프로젝트 경험을 소개하는 개인 포트폴리오입니다. Hugo Profile 테마를 기반으로 한국어 콘텐츠와 개인 프로젝트 정보를 구성했으며, GitHub Actions와 GitHub Pages를 사용해 배포합니다.

- 공개 사이트: <https://jw202421707.github.io/portfolio/>
- 저장소: <https://github.com/jw202421707/portfolio>
- 제작자: 이지우
- 전공: 전북대학교 컴퓨터인공지능학부


## 개발 환경

- Git
- Hugo Extended 0.143.0
- Python 3.12
- GitHub Actions: Ubuntu Latest
- 자동 배포 환경: Node.js 24, Go 1.27.1, Dart Sass 1.105.0

Hugo가 설치되어 있지 않다면 [Hugo 공식 설치 안내](https://gohugo.io/installation/)에서 운영체제에 맞는 Hugo Extended를 설치합니다. 설치 후 다음 명령으로 버전을 확인합니다.

```bash
hugo version
```

## 로컬 실행

저장소를 복제하고 사이트 폴더에서 개발 서버를 실행합니다.

```bash
git clone https://github.com/jw202421707/portfolio.git
cd portfolio/site
hugo server --config hugo.yaml,pages.json --theme template --themesDir themes
```

터미널에 표시되는 주소로 접속합니다. 기본 설정에서는 보통 <http://localhost:1313/portfolio/>에서 확인할 수 있습니다.

## 배포용 빌드

저장소 루트에서 GitHub Actions와 같은 준비·빌드 스크립트를 실행합니다.

```bash
cd portfolio
python .github/pages_build.py --dependencies
python .github/pages_build.py --build
```

빌드 결과는 `public/` 폴더에 생성됩니다. GitHub Actions에서는 동일한 스크립트로 빌드한 뒤 GitHub Pages에 배포합니다.


## 콘텐츠 수정 위치

- 자기소개·기술·학력·활동·프로젝트·연락처: `site/hugo.yaml`
- 프로필 및 프로젝트 이미지: `site/static/images/`
- 화면 구조와 접근성 속성: `site/themes/template/layouts/`

수정 후에는 저장소 루트에서 변경 내용을 확인하고 커밋한 뒤 `main` 브랜치로 올립니다.

```bash
git status
git add <수정한-파일>
git commit -m "변경 내용을 설명하는 메시지"
git push origin main
```

## 배포 결과 확인

1. 저장소의 **Actions** 탭에서 `Deploy Hugo to GitHub Pages` 작업을 엽니다.
2. 최신 `main` 커밋의 build와 deploy 작업이 모두 성공했는지 확인합니다.
3. <https://jw202421707.github.io/portfolio/>에 접속해 최신 내용이 표시되는지 확인합니다.
4. 메뉴, 외부 링크, 아바타와 모바일 화면에 깨진 부분이 없는지 다시 점검합니다.

Actions가 실패하면 실패한 단계의 로그를 확인하고 수정한 뒤 다시 커밋·push합니다. 공개 화면이 이전 버전이면 최신 Actions 실행이 완료되었는지 확인하고 브라우저를 새로고침합니다.


## Internationalization (i18n)

This theme supports multiple languages out of the box. Hugo Profile includes built-in translations for English, Spanish, and French, and you can easily add your own languages.

### Setting Up Multiple Languages

To enable multilingual support, add the following to your `hugo.yaml`:

```yaml
defaultContentLanguage: "en"
defaultContentLanguageInSubdir: false

languages:
  en:
    languageName: "English"
    weight: 1
  es:
    languageName: "Español"
    weight: 2
  fr:
    languageName: "Français"
    weight: 3
```

### How It Works

1. **Translation Files**: The theme includes translation files in the `i18n/` directory:
   - `en.toml` - English translations
   - `es.toml` - Spanish translations
   - `fr.toml` - French translations

2. **Language Switcher**: When you enable multiple languages, a language switcher dropdown automatically appears in the navigation bar, allowing visitors to switch between languages.

3. **Backward Compatibility**: All existing sites continue to work without any changes. The theme automatically falls back to English or your configured language if no multilingual setup is provided.

### Adding a New Language

To add support for a new language (e.g., German):

1. Create a new translation file `i18n/de.toml` in your site root or in the theme:
   ```toml
   [nav_about]
   other = "Über uns"
   
   [nav_experience]
   other = "Erfahrung"
   
   # Add all other translations...
   ```

2. Add the language to your `hugo.yaml`:
   ```yaml
   languages:
     de:
       languageName: "Deutsch"
       weight: 4
   ```

3. (Optional) Create language-specific content in `content/de/` directory.

### Customizing Translations

You can override any translation by adding it to your site's `params.terms` section in `hugo.yaml`:

```yaml
params:
  terms:
    read: "Custom Read Text"
    pageNotFound: "Custom 404 Message"
```

For more information about Hugo's multilingual features, see the [Hugo Multilingual Documentation](https://gohugo.io/content-management/multilingual/).


## Deployment

If you do not require extensive customization, the easiest way to deploy is:
1. Click the **Use this template** button to create your own repository.
2. Connect the repository to **Netlify**.

Whenever you make changes to the files inside the `exampleSite` folder, Netlify will automatically detect and deploy your changes. 

---


If you followed the steps in the [Quick Start](#quick-start) section above, you can still deploy your site to Netlify, but you'll need a few additional configurations.   

See the **[Host on Netlify](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/)** guide for further information.

---

For manual deployment, run `hugo` to generate the final, ready-to-deploy static site in the `public/` folder, which you can upload to any hosting platform.

It is recommended to delete the `public/` folder before each build to ensure it only contains the latest output:

```bash
rm -rf public/ && hugo
```


## Trouble-Shooting

```
ERROR error calling resources.GetRemote: Get "https://publish.twitter.com/oembed?dnt=false&url=https%3A%2F%2Ftwitter.com%2FGoHugoIO%2Fstatus%2F1315233626070503424": net/http: TLS handshake timeout
Built in 10266 ms
Error: error building site: logged 1 error(s)
```
The TLS handshake timeout error can happen due to network issues. If this error persists, you can delete the shortcode example `{{< tweet user="GoHugoIO" id="1315233626070503424" >}}` in the "content/blogs/rich-content.md" file.


## Issues

If you have a question, please [open an issue](https://github.com/gurusabarish/hugo-profile/issues) for help and to help those who come after you. The more information you can provide, the better!

## Contributing

Contributions, issues, and feature requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under [MIT](LICENSE)

## 🤝 Support

Give a ⭐️ or buy me a ~`coffee`~ tea if you like this project!

<a href="https://www.buymeacoffee.com/gurusabarish" target="_blank" rel="noopener"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="40" width="145" alt="Buy Me A Coffee"></a>

import * as fs from "node:fs";
import * as path from "node:path";
import { glob } from "glob";

// mdcファイルとmdディレクトリの対応関係の定義
const mdcConfigurations = [
  {
    output: ".cursor/rules/000_common_requirements.mdc",
    sourceDir: "rules/0_common",
    header:
      '---\ndescription: 共通要件\nglobs: "src/**/*.{tsx,jsx,ts,js,md}"\nalwaysApply: true\n---\n# 共通要件\n\n',
    filePattern: "**/*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_tech_stack.mdc",
    sourceDir: "rules/0_common/1_common_requirements",
    header:
      '---\ndescription: 共通技術スタック\nglobs: "src/**/*.{tsx,jsx,ts,js,md}"\nalwaysApply: true\n---\n# 共通技術スタック\n\n',
    filePattern: "1_technology_stack.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_directory_structure.mdc",
    sourceDir: "rules/0_common/3_directory_structure",
    header:
      '---\ndescription: ディレクトリ構造\nglobs: "src/**/*.{tsx,jsx,ts,js,md}"\nalwaysApply: true\n---\n# ディレクトリ構造\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_coding_conventions.mdc",
    sourceDir: "rules/0_common/2_coding_conventions",
    header:
      '---\ndescription: コーディング規約\nglobs: "src/**/*.{tsx,jsx,ts,js,md}"\nalwaysApply: true\n---\n# コーディング規約\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_test_strategy.mdc",
    sourceDir: "rules/0_common/4_test_strategy",
    header:
      '---\ndescription: テスト戦略\nglobs: "src/**/*.{tsx,jsx,ts,js,md}"\nalwaysApply: true\n---\n# テスト戦略\n\n',
    filePattern: "**/*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/001_business_requirements.mdc",
    sourceDir: "rules/1_business_requirements",
    header:
      '---\ndescription: ビジネス要件の定義\nglobs: "src/**/*.{tsx,jsx,ts,js,md}"\nalwaysApply: true\n---\n# ビジネス要件\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/002_backend_requirements.mdc",
    sourceDir: "rules/2_backend_functional_requirements",
    header:
      '---\ndescription: バックエンド機能要件\nglobs: "src/app/api/**/*.{tsx,jsx,ts,js}", "src/lib/**/*.{tsx,jsx,ts,js}", "src/types/api/**/*.{ts,js}"\nalwaysApply: true\n---\n# バックエンド機能要件\n\n',
    filePattern: "**/*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/003_frontend_requirements.mdc",
    sourceDir: "rules/3_frontend_functional_requirements",
    header:
      '---\ndescription: フロントエンド機能要件\nglobs: "src/app/**/*.{tsx,jsx,ts,js}", "!src/app/api/**/*", "src/components/**/*.{tsx,jsx,ts,js}", "src/hooks/**/*.{tsx,jsx,ts,js}", "src/context/**/*.{tsx,jsx,ts,js}"\nalwaysApply: true\n---\n# フロントエンド機能要件\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/004_nonFunctional_requirements.mdc",
    sourceDir: "rules/4_nonFunctional_requirements",
    header:
      '---\ndescription: 非機能要件\nglobs: "src/config/**/*.{tsx,jsx,ts,js}", "src/middleware/**/*.{tsx,jsx,ts,js}", "src/lib/db/**/*.{ts,js}", "src/lib/auth/**/*.{ts,js}"\nalwaysApply: true\n---\n# 非機能要件\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/005_development_process.mdc",
    sourceDir: "rules/5_development_process",
    header:
      '---\ndescription: 開発プロセス\nglobs: "src/tests/**/*.{tsx,jsx,ts,js}", "src/utils/**/*.{tsx,jsx,ts,js}", "scripts/**/*.{ts,js}"\nalwaysApply: true\n---\n# 開発プロセス\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/006_risk_and_release_plan.mdc",
    sourceDir: "rules/6_risk_and_release_plan",
    header:
      '---\ndescription: リスクとリリース計画\nglobs: "src/config/constants.{ts,js}", "src/config/feature-flags.{ts,js}", "src/lib/monitoring/**/*.{ts,js}"\nalwaysApply: true\n---\n# リスクとリリース計画\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
];

// ファイル名から数字プレフィックスを抽出してソートするための関数
function extractNumberPrefix(filename: string): number {
  const match = filename.match(/^(\d+)_/);
  return match ? parseInt(match[1], 10) : Infinity;
}

// mdファイルを検索して結合する関数
async function buildMdcFile(config: (typeof mdcConfigurations)[0]) {
  // ルートディレクトリの取得（スクリプトの実行場所から相対パスで計算）
  const rootDir = path.resolve(process.cwd());

  // mdファイルのパターンを作成
  const pattern = path.join(rootDir, config.sourceDir, config.filePattern);

  // mdファイルを検索
  const files = await glob(pattern);

  // ファイルが見つからない場合はスキップ
  if (files.length === 0) {
    console.log(`No files found in ${config.sourceDir}, skipping...`);
    return;
  }

  // ファイル名でソート
  files.sort((a: string, b: string) => {
    // ディレクトリ構造を考慮したソート
    const dirA = path.dirname(a);
    const dirB = path.dirname(b);

    // 異なるディレクトリの場合はディレクトリ名でソート
    if (dirA !== dirB) {
      return dirA.localeCompare(dirB);
    }

    // 同じディレクトリ内ではファイル名の数字プレフィックスでソート
    const fileNameA = path.basename(a);
    const fileNameB = path.basename(b);

    const numA = extractNumberPrefix(fileNameA);
    const numB = extractNumberPrefix(fileNameB);

    if (numA !== numB) {
      return numA - numB;
    }

    // 数字プレフィックスが同じ場合はファイル名全体でソート
    return fileNameA.localeCompare(fileNameB);
  });

  // コンテンツの初期化
  let content = "";

  // ヘッダー情報を追加
  content += config.header;

  // 各mdファイルの内容を結合
  for (const file of files) {
    console.log(`Processing file: ${file}`);
    const fileContent = await fs.promises.readFile(file, "utf8");

    // ファイルパスからセクションヘッダーを作成
    const relativePath = path.relative(
      path.join(rootDir, config.sourceDir),
      file
    );
    const dirName = path.dirname(relativePath);

    // ルートディレクトリ直下のファイルの場合はセクションヘッダーを追加しない
    if (dirName !== "." && !content.includes(`## ${dirName}`)) {
      content += `## ${dirName}\n\n`;
    }

    // ファイル名からセクションタイトルを抽出（オプション）
    const fileName = path.basename(file, path.extname(file));
    const fileTitle = fileName.replace(/^\d+_/, "").replace(/_/g, " ");

    // ファイルの内容を追加
    content += fileContent + "\n\n";
  }

  // mdcファイルを出力
  const outputPath = path.join(rootDir, config.output);

  // 出力ディレクトリが存在することを確認
  const outputDir = path.dirname(outputPath);
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
  } catch (error) {
    // ディレクトリが既に存在する場合は無視
  }

  // ファイルに書き込み
  await fs.promises.writeFile(outputPath, content);

  console.log(
    `Generated ${config.output} from ${files.length} files in ${config.sourceDir}`
  );
}

// 既存のMDCファイルの中身を空にする関数
async function cleanMdcFiles() {
  const rootDir = path.resolve(process.cwd());

  // .cursor/rules ディレクトリの存在確認
  const rulesDir = path.join(rootDir, ".cursor/rules");
  try {
    await fs.promises.access(rulesDir);
  } catch (error) {
    // ディレクトリが存在しない場合は作成
    await fs.promises.mkdir(rulesDir, { recursive: true });
    return;
  }

  // .mdc ファイルを検索して中身を空にする
  const mdcFiles = await glob(path.join(rulesDir, "*.mdc"));
  for (const file of mdcFiles) {
    console.log(`Clearing content of MDC file: ${file}`);
    await fs.promises.writeFile(file, ""); // ファイルの中身を空にする
  }
}

// available_instructionsファイルを生成する関数
async function generateAvailableInstructions() {
  const rootDir = path.resolve(process.cwd());
  const outputPath = path.join(rootDir, ".cursor/available_instructions.txt");

  let content =
    "Cursor rules are user provided instructions for the AI to follow to help work with the codebase.\n";
  content +=
    "They may or may not be relevent to the task at hand. If they are, use the fetch_rules tool to fetch the full rule.\n";
  content +=
    "Some rules may be automatically attached to the conversation if the user attaches a file that matches the rule's glob, and wont need to be fetched.\n\n";

  content += "000_common_requirements: 共通要件\n";
  content += "000_common_tech_stack: 共通技術スタック\n";
  content += "000_common_directory_structure: ディレクトリ構造\n";
  content += "000_common_coding_conventions: コーディング規約\n";
  content += "000_common_test_strategy: テスト戦略\n";
  content += "001_business_requirements: ビジネス要件の定義\n";
  content += "002_backend_requirements: バックエンド機能要件\n";
  content += "003_frontend_requirements: フロントエンド機能要件\n";
  content += "004_nonFunctional_requirements: 非機能要件\n";
  content += "005_development_process: 開発プロセス\n";
  content += "006_risk_and_release_plan: リスクとリリース計画\n";

  await fs.promises.writeFile(outputPath, content);
  console.log(`Generated available_instructions.txt`);
}

// メイン処理
async function main() {
  try {
    // 既存のMDCファイルを削除
    await cleanMdcFiles();

    // 各設定に対してmdcファイルを生成
    for (const config of mdcConfigurations) {
      await buildMdcFile(config);
    }

    // available_instructionsファイルを生成
    await generateAvailableInstructions();

    console.log("All mdc files have been successfully generated!");
  } catch (error) {
    console.error("Error generating mdc files:", error);
    process.exit(1);
  }
}

// スクリプトの実行
main();

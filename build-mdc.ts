import * as fs from "node:fs";
import * as path from "node:path";
import { glob } from "glob";

// mdcファイルとmdディレクトリの対応関係の定義
const mdcConfigurations = [
  {
    output: ".cursor/rules/000_common_requirements.mdc",
    sourceDir: "rules/0_common",
    header:
      '---\ndescription: 共通要件\nglobs: ["**/*.{tsx,jsx,ts,js,md}"]\nalwaysApply: false\n---\n# 共通要件\n\n',
    filePattern: "**/*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_tech_stack.mdc",
    sourceDir: "rules/0_common/1_common_requirements",
    header:
      '---\ndescription: 共通技術スタック\nglobs: ["**/*.{tsx,jsx,ts,js}"]\nalwaysApply: false\n---\n# 共通技術スタック\n\n',
    filePattern: "1_technology_stack.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_directory_structure.mdc",
    sourceDir: "rules/0_common/3_directory_structure",
    header:
      '---\ndescription: ディレクトリ構造\nglobs: ["**/*.{tsx,jsx,ts,js}"]\nalwaysApply: false\n---\n# ディレクトリ構造\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_coding_conventions.mdc",
    sourceDir: "rules/0_common/2_coding_conventions",
    header:
      '---\ndescription: コーディング規約\nglobs: ["**/*.{tsx,jsx,ts,js}"]\nalwaysApply: false\n---\n# コーディング規約\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/000_common_test_strategy.mdc",
    sourceDir: "rules/0_common/4_test_strategy",
    header:
      '---\ndescription: テスト戦略\nglobs: ["**/__tests__/**/*.{tsx,jsx,ts,js}", "**/*.test.{tsx,jsx,ts,js}"]\nalwaysApply: false\n---\n# テスト戦略\n\n',
    filePattern: "**/*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/001_business_requirements.mdc",
    sourceDir: "rules/1_business_requirements",
    header:
      '---\ndescription: ビジネス要件の定義\nglobs: ["**/*.{tsx,jsx,ts,js}"]\nalwaysApply: false\n---\n# ビジネス要件\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/002_backend_requirements.mdc",
    sourceDir: "rules/2_backend_functional_requirements",
    header:
      '---\ndescription: バックエンド機能要件\nglobs: ["**/app/api/**/*.ts", "**/lib/**/*.ts", "**/types/api/**/*.ts", "**/prisma/**/*.ts"]\nalwaysApply: false\n---\n# バックエンド機能要件\n\n',
    filePattern: "**/*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/003_frontend_requirements.mdc",
    sourceDir: "rules/3_frontend_functional_requirements",
    header:
      '---\ndescription: フロントエンド機能要件\nglobs: ["**/app/**/*.tsx", "!**/app/api/**/*", "**/components/**/*.tsx", "**/hooks/**/*.ts", "**/context/**/*.tsx"]\nalwaysApply: false\n---\n# フロントエンド機能要件\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/004_nonFunctional_requirements.mdc",
    sourceDir: "rules/4_nonFunctional_requirements",
    header:
      '---\ndescription: 非機能要件\nglobs: ["**/config/**/*.ts", "**/lib/middleware/**/*.ts", "**/lib/db/**/*.ts", "**/lib/utils/**/*.ts", "**/prisma/schema.prisma"]\nalwaysApply: false\n---\n# 非機能要件\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/005_development_process.mdc",
    sourceDir: "rules/5_development_process",
    header:
      '---\ndescription: 開発プロセス\nglobs: ["**/__tests__/**/*.{tsx,ts}", "**/lib/utils/**/*.ts", "**/scripts/**/*.ts"]\nalwaysApply: false\n---\n# 開発プロセス\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
  {
    output: ".cursor/rules/006_risk_and_release_plan.mdc",
    sourceDir: "rules/6_risk_and_release_plan",
    header:
      '---\ndescription: リスクとリリース計画\nglobs: ["**/config/constants.ts", "**/config/routes.ts", "**/lib/middleware/**/*.ts"]\nalwaysApply: false\n---\n# リスクとリリース計画\n\n',
    filePattern: "*.md",
    sortBy: "name",
  },
];

// ファイル名から数字プレフィックスを抽出してソートするための関数
function extractNumberPrefix(filename: string): number {
  const match = filename.match(/^(\d+)_/);
  return match ? parseInt(match[1], 10) : Infinity;
}

// メイン処理
async function main() {
  try {
    // 出力ディレクトリの作成
    const outputDir = path.dirname(mdcConfigurations[0].output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 各設定に対して処理を実行
    for (const config of mdcConfigurations) {
      const { output, sourceDir, header, filePattern, sortBy } = config;

      // ソースディレクトリのパスを確認
      if (!fs.existsSync(sourceDir)) {
        console.warn(`Source directory ${sourceDir} does not exist. Skipping.`);
        continue;
      }

      // ファイルの検索
      const files = await glob(path.join(sourceDir, filePattern));

      // ファイルが見つからない場合はスキップ
      if (files.length === 0) {
        console.warn(
          `No files found in ${sourceDir} matching ${filePattern}. Skipping.`
        );
        continue;
      }

      // ソート
      if (sortBy === "name") {
        files.sort();
      } else if (sortBy === "number") {
        files.sort((a, b) => {
          const aPrefix = extractNumberPrefix(path.basename(a));
          const bPrefix = extractNumberPrefix(path.basename(b));
          return aPrefix - bPrefix;
        });
      }

      // 各ファイルの内容を連結
      let content = header;

      for (const file of files) {
        const fileContent = fs.readFileSync(file, "utf-8");
        const fileName = path.basename(file);
        const dirName = path.basename(path.dirname(file));

        content += `## ${dirName}/${fileName}\n\n${fileContent}\n\n`;
      }

      // 出力
      fs.writeFileSync(output, content);
      console.log(`Generated ${output}`);
    }

    console.log("All mdc files generated successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

// スクリプトの実行
main();

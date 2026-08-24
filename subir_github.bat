@echo off
chcp 65001 > nul
echo ========================================================
echo   EVOLUTION CUSTOM SC - ENVIAR PARA O GITHUB
echo ========================================================
echo.

cd /d "%~dp0"

echo 1. Atualizando imagens do projeto...
call copiar_imagens.bat

echo.
echo 2. Inicializando e configurando o Git...
git init
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/alvesvictor146/evolution-custom.git

echo.
echo 3. Adicionando arquivos e realizando commit...
git add .
git commit -m "feat: site completo Evolution Custom SC com simulador de cores Porsche 911"

echo.
echo 4. Enviando arquivos para o GitHub (main)...
git push -u origin main --force

echo.
echo ========================================================
echo   PROCESSO CONCLUÍDO COM SUCESSO!
echo ========================================================
pause

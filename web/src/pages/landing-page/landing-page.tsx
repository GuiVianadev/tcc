import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SmLogo from "../../assets/sm-logo.svg?react"
import IconLogo from "../../assets/icon-logo.svg?react"

export function LandingPage() {
    return (
        <div className="bg-zinc-950">
            <img className="absolute mx-auto top-0 left-1/2 transform -translate-x-1/2 z-0  object-contain" src="/images/top.webp" alt="Background decoration" />
            <main className="h-screen flex flex-col py-10 z-10 mx-auto ">
                <nav className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 flex justify-between z-50  backdrop-blur">
                    <div>
                        <SmLogo className="  w-28 md:w-35 h-10" />
                    </div>
                    <div className="flex gap-2">
                        <Link to={"/sign-in"}>
                            <Button className="text-white hidden md:inline" variant={"link"}>Entrar</Button>
                        </Link>
                        <Link to={"/sign-up"}>
                            <Button variant={"cognitio"} size={"lg"}>Fazer registro</Button>
                        </Link>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto z-50 w-full pt-32 pb-16 flex flex-col items-center text-center">
                    <div className="mb-16">
                        <div className="text-white max-w-2xl flex flex-col gap-3 p-2 mb-4">
                            <h1 className="text-[3.40rem] leading-none font-bold tracking-tighter text-balance sm:text-7xl">O reforço <span className="text-orange-500 font-merri font-bold">perfeito</span> para seus estudos</h1>
                            <p className="text-base text-zinc-400 sm:text-lg"><p className="text-orange-500 font-">Passa horas estudando e sente que nada fica na cabeça? </p>O Cognitio AI usa inteligência artificial para transformar seus materiais em um plano de estudos ativo que garante a fixação do conteúdo.</p>
                        </div>
                        <Link to={"/sign-up"}>
                            <Button variant={"cognitio"} size={"lg"}>Começar agora <ArrowRight /></Button>
                        </Link>
                    </div>

                    <div className="h-[232px] relative hidden sm:block p-2">
                        <img src="/images/dash.webp" alt="Dashboard preview" />
                    </div>
                </div>

                <section className="border-t border-b bg-zinc-950 border-zinc-900 bg-features py-10 sm:py-20">
                    <div className="text-center p-2">
                        <h1 className=" text-white text-2xl sm:text-3xl font-semibold leading-snug">
                            Como funciona a mágica?
                        </h1>
                        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                            Em simples passos, você sai do estudo passivo para o aprendizado de verdade.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-4 max-w-7xl mx-auto">

                        <div className="flex flex-col overflow-hidden border border-zinc-800 rounded-lg bg-white/[0.02]">
                            <img loading="lazy" src="/images/generatemateriais.webp" alt="Upload de materiais" />
                            <div className="p-5 flex flex-col gap-3 border-t border-zinc-800">
                                <h1 className="text-base font-medium inline-flex items-center gap-2 text-white">Envie seu Material ou Tópico</h1>
                                <p className="text-zinc-400 text-sm leading-relaxed">Faça o upload do PDF da aula, artigos, anotações ou tópico. Nossa IA vai ler e entender os pontos principais para você.</p>
                            </div>
                        </div>
                        <div className="flex flex-col overflow-hidden border border-zinc-800 rounded-lg bg-white/[0.02]">
                            <div className="p-5 flex flex-col gap-3  border-b border-zinc-800">
                                <h1 className="text-base font-medium inline-flex items-center gap-2 text-white">A IA cria suas ferramentas</h1>
                                <p className="text-zinc-400 text-sm leading-relaxed">Em segundos, receba quizzes para testar seu conhecimento e flashcards para memorizar a longo prazo.</p>
                            </div>
                            <img loading="lazy" src="/images/quizz.webp" alt="Quiz gerado pela IA" />
                        </div>
                        <div className="flex flex-col overflow-hidden border border-zinc-800 rounded-lg bg-white/[0.02]">
                            <img loading="lazy" src="/images/dashandcalendar.webp" alt="Dashboard e calendário de estudos" />
                            <div className="p-5 flex flex-col gap-3  border-t border-zinc-800">
                                <h1 className="text-base font-medium inline-flex items-center gap-2 text-white">Estude e veja seu progresso</h1>
                                <p className="text-zinc-400 text-sm leading-relaxed">Siga seu plano de revisão, mantenha o foco com a consistência e acompanhe seu progresso em cada Conteúdo.</p>
                            </div>
                        </div>

                    </div>
                </section>

                <footer className="border-zinc-900 bg-zinc-950 border-t py-8">
                    <div className="mx-auto max-w-7xl flex gap-3">
                        <div className="px-2 flex w-full  justify-between items-center">
                            <div className="flex justify-center items-center gap-6 px-6">
                                <IconLogo className="w-6" />
                                <p className="text-sm text-zinc-600">© 2025 Cognition AI</p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-zinc-600">Desenvolvido por:</p>
                                <p className="text-sm text-zinc-600"> Guilherme Viana e Fred Alisson</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    )
}